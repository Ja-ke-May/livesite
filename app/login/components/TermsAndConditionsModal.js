import React from 'react';

const TermsAndConditionsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white text-black max-w-3xl w-full p-8 rounded-lg shadow-lg overflow-y-auto h-3/4">
        <h2 className="text-2xl font-bold mb-4">Terms and Conditions</h2>
        <div className="overflow-y-auto h-3/4 text-sm">
          <p>
            Welcome to MyMe! By accessing or using the MyMe website and services (collectively, the "Platform"), you agree to comply with and be bound by the following terms and conditions (the "Terms"). Please read these Terms carefully before using our Platform. If you do not agree to these Terms, you must not use MyMe.
          </p>
          <h3 className="text-lg font-semibold mt-4">1. Acceptance of Terms</h3>
          <p>
            By creating an account, accessing, or using any part of the Platform, you agree to be bound by these Terms and our Privacy Policy. These Terms constitute a legally binding agreement between you ("User") and MyMe ("Company"). You must agree to these Terms to sign up for and use the Platform.
          </p>
          <h3 className="text-lg font-semibold mt-4">2. Eligibility</h3>
          <p>
            You must be at least 18 years old to use MyMe. By using the Platform, you represent and warrant that you are 18 years of age or older. MyMe is intended for adults only, and any use by individuals under 18 is strictly prohibited.
          </p>
          <h3 className="text-lg font-semibold mt-4">3. User Conduct and Community Guidelines</h3>
          <div>
            <p>
            You agree to use MyMe in a manner that is lawful, respectful, and in compliance with these Terms. The following are strictly prohibited:
            </p> 
            <ul className="list-disc ml-4 mt-2">
              <li>Illegal or Harmful Content: Posting or streaming content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable.</li>
              <li>Misinformation and Disinformation: MyMe is a platform for open dialogue and free expression. However, views shared on the site are not guaranteed to be factual, and users are not liable for accidentally sharing incorrect information.</li>
              <li>Harassment and Abuse: Engaging in harassment, hate speech, discrimination, or any form of abuse will result in immediate action, including temporary or permanent bans depending on the severity.</li>
              <li>Spam and Unsolicited Content: Spamming, phishing, and any form of unsolicited communication are not permitted.</li>
              <li>Impersonation: Misrepresenting your identity or affiliation with any person or entity is strictly prohibited.</li>
            </ul>
          </div>
          <p>
            <strong>Moderation and Enforcement:</strong> MyMe reserves the right to ban or remove any users from the queue, chat, or Platform at any time for any reason, without notice. Users can report inappropriate behaviour by clicking on a username. Reports will be reviewed, and appropriate action will be taken, including temporary bans for minor offences and permanent bans for serious violations.
          </p>
          <h3 className="text-lg font-semibold mt-4">4. Content Ownership and Usage</h3>
<p>
  By posting or streaming content on MyMe, you grant MyMe a non-exclusive, royalty-free, worldwide, perpetual license to use, display, reproduce, modify, and distribute your content for any purpose, including but not limited to promotional activities on MyMe’s social media or other platforms.
</p>
<p>
  You retain the right to share your content on other platforms at your discretion. However, if you wish to use content created by other users, you must obtain their explicit permission before doing so. This ensures that all users maintain control over how their content is used and shared by others.
</p>
<p>
  MyMe may record and share content streamed on the Platform through its social media channels or other platforms. Users acknowledge that live content is inherently public and should not expect privacy regarding what they stream.
</p>

          <h3 className="text-lg font-semibold mt-4">5. Data Collection and Privacy</h3>
          <p>
            MyMe collects and stores personal information, including but not limited to user emails, which are encrypted to ensure privacy and security. User emails are used for essential communication and, if opted in, for marketing purposes. MyMe uses Google Analytics and other implemented methods to track user behaviour on the site. This data is used to improve the user experience and optimise the Platform.
          </p>
          <p>
            MyMe complies with the Data Protection Act 2018 and UK GDPR. Users have the right to access, rectify, or request the deletion of their personal data. Users may request the deletion of their account and personal information by directly contacting MyMe. Currently, there is no option to delete accounts or remove information through user settings.
          </p>
          <h3 className="text-lg font-semibold mt-4">6. Security and Risk Awareness</h3>
          <p>
            MyMe implements security measures to protect user data and content. Additional security features will be added as the Platform grows.
          </p>
          <p>
            Users acknowledge the risks associated with live streaming, including the potential for exposure of personal information and the inherent unpredictability of live content. MyMe is not liable for any consequences resulting from live broadcasts or the sharing of personal information by users.
          </p>
          <h3 className="text-lg font-semibold mt-4">7. Payment and Tokens</h3>
          <p>
            Payments on MyMe are processed through Stripe. By purchasing tokens or any other services, you agree to Stripe’s terms and conditions. All token purchases are final, and no refunds will be provided for tokens bought with real money. If your account is banned, all tokens associated with your account will be forfeited.
          </p>
          <h3 className="text-lg font-semibold mt-4">8. User Agreement</h3>
          <div>
            <p>
            By signing up for MyMe, you agree to the following:
            </p>
            <ul className="list-disc ml-4 mt-2">
              <li>Adherence to Terms: You have read, understood, and agree to these Terms and Conditions.</li>
              <li>Content Responsibility: You are solely responsible for the content you stream, post, or share on MyMe.</li>
              <li>Acceptance of Risk: You acknowledge the risks associated with live streaming and sharing personal information on a public platform.</li>
            </ul>
            </div>
          <h3 className="text-lg font-semibold mt-4">9. Contact and Communication</h3>
          <p>
            MyMe may contact users via email for essential communication regarding their account, the Platform, or any legal matters. Marketing emails will only be sent to users who have opted in. For any issues, questions, or requests, including account deletion, please contact us at info@myme.live.
          </p>
          <h3 className="text-lg font-semibold mt-4">10. Limitation of Liability</h3>
          <p>
            To the maximum extent permitted by law, MyMe and its affiliates shall not be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in connection with your use of the Platform, including but not limited to damages for loss of profits, goodwill, use, data, or other intangible losses.
          </p>
          <h3 className="text-lg font-semibold mt-4">11. Indemnification</h3>
          <p>
            You agree to indemnify and hold harmless MyMe, its affiliates, and their respective officers, directors, employees, and agents from any and all claims, liabilities, damages, losses, and expenses, including reasonable legal fees, arising out of or in any way connected with your access to or use of the Platform or your violation of these Terms.
          </p>
          <h3 className="text-lg font-semibold mt-4">12. Changes to Terms</h3>
          <p>
            We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on the Platform. Your continued use of the Platform after any such changes constitutes your acceptance of the new Terms.
          </p>
          <h3 className="text-lg font-semibold mt-4">13. Governing Law</h3>
          <p>
            These Terms and any disputes arising out of or related to the Platform shall be governed by and construed in accordance with the laws of England, UK, without regard to its conflict of law principles.
          </p>
          <h3 className="text-lg font-semibold mt-4">14. Contact Information</h3>
          <p>
            If you have any questions about these Terms, please contact us at info@myme.live.
          </p>
        </div>
        <button
          onClick={onClose}
          className="mt-6 py-2 px-4 bg-red-500 text-white rounded-md hover:bg-[#000110] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TermsAndConditionsModal;
