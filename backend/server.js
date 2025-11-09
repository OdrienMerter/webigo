// --- CONFIGURATION ---
// Charge les variables d'environnement depuis le fichier .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
// Importe le client Resend
const { Resend } = require('resend');

// --- INITIALISATION ---
const app = express();
const PORT = process.env.PORT || 3001;

// Initialise le client Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialise le client Resend avec votre clé API
const resend = new Resend(process.env.RESEND_API_KEY);


// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());

// --- ROUTE API ---
app.post('/api/devis', async (req, res) => {
  console.log('\n--- Nouvelle demande de devis reçue ---');
  console.log('Données reçues:', req.body);

  const { name, email, phone, company, projectType, projectDescription, budget } = req.body;

  // Validation
  if (!name || !email || !projectType || !projectDescription) {
    console.log("[ERREUR] Validation échouée : champs manquants.");
    return res.status(400).json({ message: 'Tous les champs requis ne sont pas remplis.' });
  }
  
  console.log("[OK] Validation des données réussie.");

  // 1. Enregistrement dans la base de données
  try {
    const { error: dbError } = await supabase
      .from('devis')
      .insert([{ name, email, phone, company, projectType, projectDescription, budget }]);

    if (dbError) {
      throw dbError; // Fait passer l'erreur au bloc catch
    }

    console.log('[OK] Données enregistrées dans Supabase avec succès.');

    // 2. Envoi de l'email de confirmation au client (après succès de la BDD)
    try {
      await resend.emails.send({
        from: 'Webigo <onboarding@resend.dev>', // Adresse d'envoi requise par Resend en mode test
        to: [email], // Email du client
        subject: 'Webigo - Confirmation de votre demande de devis',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h1 style="color: #4F46E5;">Bonjour ${name},</h1>
            <p>Merci de nous avoir contactés ! Nous confirmons avoir bien reçu votre demande de devis pour un projet de type : <strong>${projectType}</strong>.</p>
            <p>Notre équipe va étudier votre projet avec la plus grande attention et reviendra vers vous dans les plus brefs délais (généralement sous 24 à 48 heures).</p>
            <p>Pour rappel, voici le descriptif de votre projet :</p>
            <blockquote style="background-color: #f4f5f7; border-left: 5px solid #6366f1; margin: 0; padding: 10px 20px;">
              <p style="margin: 0;"><em>${projectDescription}</em></p>
            </blockquote>
            <p>À très bientôt,<br><strong>L'équipe Webigo</strong></p>
          </div>
        `,
      });
      console.log(`[OK] Email de confirmation envoyé avec succès à ${email}.`);
    } catch (emailError) {
      // Important : on logue l'erreur mais on ne bloque pas le processus.
      // La demande est sauvée, c'est le principal.
      console.error("[ATTENTION] La demande a été enregistrée, mais l'envoi de l'email de confirmation a échoué:", emailError.message);
    }

    console.log('------------------------------------\n');
    
    // Si tout s'est bien passé (au moins la sauvegarde BDD), on renvoie une réponse de succès
    res.status(201).json({ message: 'Demande de devis reçue et enregistrée avec succès !' });

  } catch (error) {
    console.error("[ERREUR] Une erreur est survenue lors du traitement de la demande :", error.message);
    res.status(500).json({ message: "Une erreur est survenue lors de l'enregistrement de votre demande." });
  }
});

// --- DÉMARRAGE DU SERVEUR ---
app.listen(PORT, () => {
  console.log(`\n>>> 🎉 Serveur backend démarré et à l'écoute sur http://localhost:${PORT} <<<\n`);
});
