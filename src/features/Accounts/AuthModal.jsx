import React, { useState } from 'react';
import Modal from './Modal';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import EmailConfirmation from './EmailConfirmation';

const AuthModal = ({ isOpen, onClose, initialView, showToast }) => {
  const [view, setView] = useState(initialView);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {view === 'signin' && (
        <>
          <h2>Sign in to your account</h2>
          <SignInForm onSuccess={onClose} showToast={showToast} />
          <button onClick={() => setView('signup')}>
            Need an account? Sign up
          </button>
        </>
      )}
      {view === 'signup' && (
        <>
          <h2>Create a new account</h2>
          <SignUpForm onSuccess={() => setView('emailConfirmation')} showToast={showToast} />
          <button onClick={() => setView('signin')}>
            Already have an account? Sign in
          </button>
        </>
      )}
      {view === 'emailConfirmation' && (
        <EmailConfirmation
          isInModal={true}
          onSuccess={() => setView('signin')}
          showToast={showToast}
        />
      )}
    </Modal>
  );
};

export default AuthModal;
