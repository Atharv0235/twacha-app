import React from 'react';
import LegalPage from './LegalPage';
import { CONTACT_EMAIL, WAQI_CREDIT } from '../config';

const contact = CONTACT_EMAIL
  ? `Questions about your data: ${CONTACT_EMAIL}.`
  : 'Questions about your data: ask the project team through your course instructor.';

export default function PrivacyPolicy({ onBack }) {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="October 2026"
      onBack={onBack}
      sections={[
        {
          heading: 'What happens to your photo',
          paragraphs: [
            'When you scan, your photo is sent over the internet to the Twacha server. The server looks for a face, measures a few visible skin features and returns the results. The photo is held in the server\'s memory only while it is analysed. The server code does not write it to disk or a database, and it is not shared with anyone.',
            'We cannot promise what the hosting provider\'s infrastructure does with network traffic in general, so please do not upload photos you are not comfortable sending to a small student-run service.'
          ]
        },
        {
          heading: 'What we store on the server',
          bullets: [
            'Your scan scores (acne, redness, dryness, a skin-tone value), the date, and the air-quality reading for your city at that time.',
            'The foods you log.',
            'An anonymous random ID created on your phone, which links these records together. We do not ask for your name, email or phone number, and the name you type in the app stays on your phone.'
          ]
        },
        {
          heading: 'What stays on your phone',
          bullets: [
            'Your first name and city.',
            'Your latest result, so the app can show it without asking the server again.',
            'Small preview thumbnails of your photos for your timeline, if you chose to keep them. You can delete them from the Progress screen.'
          ]
        },
        {
          heading: 'Third parties',
          paragraphs: [
            `Your city name is sent to the World Air Quality Index Project (aqicn.org) to look up air quality. ${WAQI_CREDIT}. The app loads fonts from Google Fonts. We do not use advertising or analytics trackers, and we do not sell data.`
          ]
        },
        {
          heading: 'Deleting your data',
          paragraphs: [
            'Open About, then "Delete all my data". This removes your scores and food log from the server and clears everything stored on your phone. If you lose your phone or reinstall the app, the old anonymous ID is lost and we cannot find or delete those old records for you; ask the team and we will remove old demo data by hand where possible.'
          ]
        },
        {
          heading: 'Limits of this project',
          paragraphs: [
            'This is a prototype built for a class. It has not been audited and does not claim to meet any specific data-protection law. Do not rely on it for sensitive or medical purposes.',
            contact
          ]
        }
      ]}
    />
  );
}
