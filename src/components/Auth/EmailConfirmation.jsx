const EmailConfirmation = ({ isInModal = false, onSuccess, showToast }) => {
    const [status, setStatus] = useState(isInModal ? 'waiting' : 'confirming');
    const { uidb64, token } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
  
    useEffect(() => {
      if (!isInModal) {
        const confirm = async () => {
          try {
            await confirmEmail(uidb64, token);
            setStatus('success');
            dispatch(loginSuccess());
            showToast('Email verified successfully!', 'success');
            navigate('/setup-2fa');
          } catch (error) {
            setStatus('error');
            showToast('Email verification failed. Please try again.', 'error');
          }
        };
        confirm();
      }
    }, [uidb64, token, dispatch, navigate, showToast, isInModal]);
  
    const handleLoginRedirect = () => {
      if (isInModal) {
        onSuccess();
      } else {
        navigate('/');
      }
    };
  
    if (isInModal) {
      return (
        <div className={styles.container}>
          <h2>Check Your Email</h2>
          <p>We've sent you an email with a confirmation link. Please check your inbox and click the link to activate your account.</p>
          <button onClick={handleLoginRedirect} className={styles.loginButton}>Back to Login</button>
        </div>
      );
    }
  
    return (
      <div className={styles.container}>
        {status === 'confirming' && <p>Confirming your email...</p>}
        {status === 'success' && (
          <div>
            <h2>Email Confirmed!</h2>
            <p>Your email has been successfully confirmed. You will be redirected to set up two-factor authentication.</p>
          </div>
        )}
        {status === 'error' && (
          <div>
            <h2>Confirmation Failed</h2>
            <p>We couldn't confirm your email. The link may have expired or is invalid.</p>
            <button onClick={handleLoginRedirect} className={styles.loginButton}>Back to Login</button>
          </div>
        )}
      </div>
    );
  };
  
  export default EmailConfirmation;