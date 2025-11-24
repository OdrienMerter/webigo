import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { GoogleGenAI, Type } from '@google/genai';

// --- CONFIGURATION ---
// Recreate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });


// --- VALIDATION DES VARIABLES D'ENVIRONNEMENT ---
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'RESEND_API_KEY', 'GOOGLE_API_KEY', 'AGENCY_EMAIL'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error("\n[ERREUR CRITIQUE] Le serveur ne peut pas démarrer.");
  console.error("Les variables d'environnement suivantes sont manquantes dans votre fichier .env :");
  missingEnvVars.forEach(varName => console.error(`- ${varName}`));
  console.error("\nVeuillez vérifier le nom du fichier (doit être '.env'), son emplacement (dans 'backend/'), et les noms des variables, puis redémarrez le serveur.\n");
  process.exit(1); // Arrête le processus pour empêcher de tourner avec une config incomplète
}
console.log("[OK] Toutes les variables d'environnement sont chargées.");


// --- INITIALISATION ---
const app = express();
const PORT = process.env.PORT || 3001;

// Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Google AI
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });


// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());

// --- UTILITAIRES ---
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


// --- FONCTION DE GÉNÉRATION D'IMAGE IA ---
async function generateWebsitePreviewImage(websitePrompt) {
  if (!websitePrompt?.designAesthetics) {
    console.log("[IA Image] Manque de données de design pour générer une image.");
    return null;
  }

  const { tone, visualInspiration, colorPalette } = websitePrompt.designAesthetics;

  const imagePrompt = `
    Website homepage UI/UX design.
    Style: ${tone}, inspired by ${visualInspiration}.
    Main colors: ${colorPalette.primary} (primary), ${colorPalette.secondary} (secondary), with ${colorPalette.accent} accents.
    The design should feel: ${colorPalette.justification}.
    Show a full-page layout including a header, hero section, and some content blocks.
    Clean, modern, professional, high resolution, digital art.
  `;
  
  console.log("[IA Image] Démarrage de la génération d'image...");

  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: imagePrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '16:9',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
      console.log("[IA Image] Génération d'image réussie.");
      return imageUrl;
    } else {
      console.warn("[IA Image - AVERTISSEMENT] La réponse de l'API ne contient pas d'images.");
      return null;
    }
  } catch (error) {
    console.error("\n[ERREUR IA Image] La génération d'image a échoué.");
    console.error("Détails de l'erreur:", error.message, "\n");
    return null;
  }
}


// --- FONCTION D'ANALYSE & GÉNÉRATION DE PROMPT IA ---
async function generateEnhancedAnalysis(formData) {
  if (!formData || !formData.projectDescription) return null;
  
  const maxRetries = 3;
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[IA] Tentative ${attempt}/${maxRetries} pour l'analyse et la génération du prompt...`);
      
      const promptContent = `Analyse la demande de devis suivante et génère le cahier des charges pour un site web. Client: ${formData.name}, Entreprise: ${formData.company || 'Non spécifié'}, Type de projet: ${formData.projectType}, Budget: ${formData.budget || 'Non spécifié'}, Description: "${formData.projectDescription}"`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: promptContent,
        config: {
          systemInstruction: "Tu es un stratège digital et un architecte de solutions web de classe mondiale pour l'agence 'Webigo'. Ta mission est de transformer une demande de devis brute en une double analyse structurée en JSON, qui servira de fondation pour créer un site web exceptionnel et unique.\nLa première partie (`analysis`) est une analyse concise pour l'équipe interne (résumé, priorité, mots-clés).\nLa seconde partie (`websitePrompt`) est un cahier des charges créatif et ultra-détaillé pour une IA de conception de site. Pour chaque demande, tu dois aller au-delà des informations fournies, faire preuve d'extrapolation intelligente et d'une créativité exceptionnelle pour définir une identité de marque forte et une expérience utilisateur mémorable.\nAnticipe les besoins non-exprimés du client. Propose des concepts uniques basés sur son secteur. Sois audacieux dans tes suggestions de design et de contenu. Le résultat doit être structuré *exclusivement* en JSON, en respectant scrupuleusement le schéma fourni.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              analysis: {
                type: Type.OBJECT,
                description: "Analyse rapide pour l'équipe de l'agence.",
                properties: {
                  summary: { type: Type.STRING, description: 'Un bref résumé du projet du client.' },
                  priority: { type: Type.INTEGER, description: 'Une note de priorité de 1 (faible) à 5 (élevée).' },
                  keywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Une liste de mots-clés techniques ou de services (ex: "e-commerce", "SEO").' }
                }
              },
              websitePrompt: {
                type: Type.OBJECT,
                description: "Cahier des charges créatif et ultra-détaillé pour la génération du site web.",
                properties: {
                  businessProfile: {
                    type: Type.OBJECT,
                    description: "Profil de l'entreprise, de sa marque et de son positionnement unique.",
                    properties: {
                      name: { type: Type.STRING, description: "Nom de l'entreprise ou du projet." },
                      activity: { type: Type.STRING, description: "Secteur d'activité et description courte." },
                      targetAudience: { type: Type.STRING, description: "Description détaillée et créative de la clientèle cible (persona)." },
                      brandValues: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Valeurs clés de la marque (ex: 'Confiance', 'Innovation', 'Artisanat')." },
                      uniqueSellingProposition: { type: Type.STRING, description: "Proposition de Vente Unique (USP) déduite ou créée pour le client. Qu'est-ce qui le rend absolument unique ?" }
                    }
                  },
                  websiteGoal: { type: Type.STRING, description: "Objectif principal et mesurable du site web (ex: 'Générer 20% de leads en plus', 'Devenir la référence locale sur Google')." },
                  designAesthetics: {
                    type: Type.OBJECT,
                    description: "Directives précises sur le design et l'identité visuelle.",
                    properties: {
                      tone: { type: Type.STRING, description: "Ton général du site (ex: 'Professionnel et rassurant', 'Moderne et audacieux', 'Chaleureux et artisanal')." },
                      visualInspiration: { type: Type.STRING, description: "Concept visuel ou style artistique (ex: 'Minimalisme suisse avec une touche de néon', 'Style organique inspiré de la nature')." },
                      colorPalette: {
                        type: Type.OBJECT,
                        description: "Palette de couleurs spécifique avec justification.",
                        properties: {
                          primary: { type: Type.STRING, description: "Couleur primaire (code hexadécimal)." },
                          secondary: { type: Type.STRING, description: "Couleur secondaire (code hexadécimal)." },
                          accent: { type: Type.STRING, description: "Couleur d'accentuation (code hexadécimal)." },
                          justification: { type: Type.STRING, description: "Brève explication du choix des couleurs et de l'émotion visée." }
                        }
                      },
                      typography: {
                        type: Type.OBJECT,
                        description: "Choix de typographies avec justification.",
                        properties: {
                          headlineFont: { type: Type.STRING, description: "Nom de la police pour les titres (ex: 'Montserrat')." },
                          bodyFont: { type: Type.STRING, description: "Nom de la police pour le corps de texte (ex: 'Lato')." },
                          justification: { type: Type.STRING, description: "Brève explication du choix des polices pour s'aligner avec la marque." }
                        }
                      }
                    }
                  },
                  sitemap: { type: Type.ARRAY, description: "Liste des pages principales du site web.", items: { type: Type.STRING } },
                  pageContent: {
                    type: Type.ARRAY,
                    description: "Description détaillée du contenu et des interactions pour chaque page majeure.",
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        page: { type: Type.STRING, description: "Nom de la page (ex: 'Accueil')." },
                        sections: {
                          type: Type.ARRAY, description: "Liste des sections à inclure sur cette page.",
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              title: { type: Type.STRING, description: "Titre accrocheur et créatif de la section." },
                              content: { type: Type.STRING, description: "Description du contenu, des éléments visuels et du message clé de la section." },
                              callToAction: {
                                type: Type.OBJECT,
                                description: "Appel à l'action spécifique pour cette section.",
                                properties: {
                                  text: { type: Type.STRING, description: "Texte du bouton ou du lien (ex: 'Découvrir nos créations')." },
                                  goal: { type: Type.STRING, description: "Objectif de ce CTA (ex: 'Diriger vers la galerie', 'Inciter à la prise de contact')." }
                                }
                              },
                              microInteractionIdea: { type: Type.STRING, description: "Suggestion d'une micro-interaction ou animation subtile pour améliorer l'expérience (ex: 'Effet de survol sur les icônes', 'Chargement progressif des images')." }
                            }
                          }
                        }
                      }
                    }
                  },
                  keyFunctionalities: { type: Type.ARRAY, description: "Liste des fonctionnalités techniques clés requises (ex: 'Prise de RDV en ligne', 'Galerie filtrable').", items: { type: Type.STRING } },
                  seoStrategy: {
                    type: Type.OBJECT,
                    description: "Stratégie de référencement initiale.",
                    properties: {
                      focusKeywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Liste de 3 à 5 mots-clés principaux à cibler." },
                      homepageMetaTitle: { type: Type.STRING, description: "Suggestion de balise <title> optimisée pour la page d'accueil." },
                      homepageMetaDescription: { type: Type.STRING, description: "Suggestion de balise <meta description> pour la page d'accueil." },
                      contentIdeas: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Liste de 2-3 idées de contenus (articles de blog, guides) pour attirer la cible." }
                    }
                  }
                }
              }
            }
          }
        }
      });
      
      const result = JSON.parse(response.text);
      console.log("[IA] Analyse et génération de prompt terminées avec succès.");
      return result; // Succès, on quitte la fonction

    } catch (error) {
      lastError = error;
      const errorMessage = error.message || '';

      // Vérifie si l'erreur est une surcharge temporaire (503)
      if (errorMessage.includes('503') || errorMessage.toLowerCase().includes('overloaded')) {
        if (attempt < maxRetries) {
          const delay = 1000 * Math.pow(2, attempt - 1); // Attente exponentielle: 1s, 2s
          console.warn(`[IA - AVERTISSEMENT] Le modèle est surchargé (tentative ${attempt}). Nouvelle tentative dans ${delay / 1000}s...`);
          await sleep(delay);
        } else {
          console.error(`[IA - ERREUR] Le modèle est toujours surchargé après ${maxRetries} tentatives.`);
        }
      } else {
        // Erreur non récupérable (ex: clé API invalide), on arrête les tentatives
        console.error("\n[ERREUR IA] Une erreur non récupérable est survenue. L'analyse du projet a échoué.");
        console.error("Détails de l'erreur:", error.message, "\n");
        return null;
      }
    }
  }

  // Si toutes les tentatives ont échoué
  console.error("\n[ERREUR IA] L'analyse du projet a échoué après toutes les tentatives. Cause probable : Surcharge persistante du modèle ou autre problème API.");
  if(lastError) console.error("Dernière erreur enregistrée:", lastError.message, "\n");
  return null;
}


// --- ROUTE API ---
app.post('/api/devis', async (req, res) => {
  console.log('\n--- Nouvelle demande de devis reçue ---');
  console.log('Données reçues:', req.body);

  const { name, email, phone, company, projectType, projectDescription, budget } = req.body;

  if (!name || !email || !projectType || !projectDescription) {
    console.log("[ERREUR] Validation échouée : champs manquants.");
    return res.status(400).json({ message: 'Tous les champs requis ne sont pas remplis.' });
  }
  
  console.log("[OK] Validation des données réussie.");

  try {
    // 1. Analyse IA améliorée et génération du prompt
    const enhancedAnalysis = await generateEnhancedAnalysis(req.body);
    let imageUrl = null;

    if (enhancedAnalysis?.websitePrompt) {
      console.log("[INFO] Analyse IA réussie, tentative de génération d'image...");
      imageUrl = await generateWebsitePreviewImage(enhancedAnalysis.websitePrompt);
    } else {
      console.log("[INFO] L'analyse IA n'a pas retourné de cahier des charges, la génération d'image est ignorée.");
    }
    
    // 2. Préparation des données pour l'enregistrement
    const submissionData = {
      name,
      email,
      phone,
      company,
      projectType,
      projectDescription,
      budget,
      ai_summary: enhancedAnalysis?.analysis?.summary || null,
      ai_priority: enhancedAnalysis?.analysis?.priority || null,
      ai_keywords: enhancedAnalysis?.analysis?.keywords || null,
      // NOTE: Assurez-vous d'avoir une colonne 'ai_website_prompt' (type JSONB recommandé) dans votre table 'devis' sur Supabase.
      ai_website_prompt: enhancedAnalysis?.websitePrompt || null,
    };

    // 3. Enregistrement dans la base de données
    const { error: dbError } = await supabase
      .from('devis')
      .insert([submissionData]);
    if (dbError) throw dbError;
    console.log('[OK] Données enregistrées dans Supabase avec succès.');

    // 4. Notification à l'agence (email enrichi par l'IA)
    try {
      await resend.emails.send({
        from: 'Alerte Devis Webigo <onboarding@resend.dev>',
        to: [process.env.AGENCY_EMAIL],
        subject: `Nouveau Devis [${projectType}] de ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h1>🔥 Nouveau Lead Qualifié !</h1>
            <p><strong>Client:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${phone ? `<p><strong>Téléphone:</strong> ${phone}</p>` : ''}
            ${company ? `<p><strong>Entreprise:</strong> ${company}</p>` : ''}
            <p><strong>Type de projet:</strong> ${projectType}</p>
            ${budget ? `<p><strong>Budget:</strong> ${budget}</p>` : ''}
            <hr>
            <h2>Analyse Rapide par l'IA</h2>
            ${enhancedAnalysis?.analysis ? `
              <p><strong>Priorité:</strong> ${'⭐'.repeat(enhancedAnalysis.analysis.priority)}${'☆'.repeat(5 - enhancedAnalysis.analysis.priority)} (${enhancedAnalysis.analysis.priority}/5)</p>
              <p><strong>Mots-clés:</strong> ${enhancedAnalysis.analysis.keywords.join(', ')}</p>
              <h3>Résumé de l'IA:</h3>
              <p><em>${enhancedAnalysis.analysis.summary}</em></p>
            ` : "<p>L'analyse rapide n'a pas pu être effectuée.</p>"}
            <hr>
            <h2>Description complète du client:</h2>
            <blockquote style="background-color: #f4f5f7; border-left: 5px solid #6366f1; margin: 0; padding: 10px 20px;">
              <p style="margin: 0;"><em>${projectDescription}</em></p>
            </blockquote>
            <hr>
            ${enhancedAnalysis?.websitePrompt ? `
              <h2>🤖 Prompt de Génération de Site Web</h2>
              <pre style="background-color: #2d3748; color: #e2e8f0; padding: 15px; border-radius: 5px; white-space: pre-wrap; word-wrap: break-word; font-family: monospace; font-size: 14px;"><code>${JSON.stringify(enhancedAnalysis.websitePrompt, null, 2)}</code></pre>
            ` : ''}
          </div>
        `,
      });
      console.log(`[OK] Email de notification envoyé à l'agence.`);
    } catch (agencyEmailError) {
      console.error("\n[ERREUR EMAIL AGENCE] L'envoi a échoué. Cause probable: Clé Resend ou email de l'agence invalide/manquant.");
      console.error("Détails de l'erreur:", agencyEmailError.message, "\n");
    }
    
    // 5. Email de confirmation au client
    let clientEmailSent = false;
    try {
      await resend.emails.send({
        from: 'Webigo <onboarding@resend.dev>',
        to: [email],
        subject: 'Webigo - Confirmation de votre demande de devis',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
              <h1 style="color: #6366f1;">Merci, ${name} !</h1>
              <p>Nous avons bien reçu votre demande de devis pour un projet de type : <strong>${projectType}</strong>.</p>
              <p>Votre projet nous intéresse beaucoup et nous sommes en train d'étudier les détails que vous nous avez fournis.</p>
              <p>Un membre de notre équipe reviendra vers vous sous <strong>48 heures</strong> pour discuter de votre vision plus en détail.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
              <p style="font-size: 0.9em; color: #777;">
                Si vous avez des questions en attendant, n'hésitez pas à nous contacter à <a href="mailto:${process.env.AGENCY_EMAIL}" style="color: #6366f1;">${process.env.AGENCY_EMAIL}</a>.
              </p>
              <p style="font-size: 0.9em; color: #777;">
                Cordialement,<br>
                L'équipe Webigo
              </p>
            </div>
          </div>  
        `,
      });
      clientEmailSent = true;
      console.log(`[OK] Email de confirmation envoyé avec succès à ${email}.`);
    } catch (clientEmailError) {
      console.error("\n[ERREUR EMAIL CLIENT] L'envoi a échoué. Cause probable: Clé Resend invalide ou email client incorrect.");
      console.error("Détails de l'erreur:", clientEmailError.message, "\n");
    }

    console.log('------------------------------------\n');
    
    res.status(201).json({ 
      message: 'Demande de devis reçue et enregistrée.',
      emailSent: clientEmailSent,
      imageUrl: imageUrl,
    });

  } catch (error) {
    console.error("[ERREUR CRITIQUE] Le processus a échoué :", error.message);
    res.status(500).json({ message: "Une erreur est survenue lors de l'enregistrement de votre demande." });
  }
});


// --- DÉMARRAGE DU SERVEUR ---
app.listen(PORT, () => {
  console.log(`>>> 🎉 Serveur backend démarré et à l'écoute sur http://localhost:${PORT} <<<\n`);
});