import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Nav } from 'react-bootstrap';
import { useUser } from '../contexts/UserContext';
import LoadingButton from './ui/LoadingButton';
import { toast } from 'react-toastify';

export default function LoginSignup() {
  const { login, register } = useUser();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const checkEmail = () => {
    if (!email.includes('@')) return false;
    if (!email.includes('.')) return false;
    return true;
  };

  const checkPassword = () => {
    if (password.length < 8) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!/\d/.test(password)) return false;
    if (!/[@$!%*?&]/.test(password)) return false;
    return true;
  };

  const checkName = () => {
    if (name.length < 3) return false;
    for (let i = 0; i < name.length; i++) {
      if (name[i] >= '0' && name[i] <= '9') return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setNameError('');
    setEmailError('');
    setPasswordError('');

    let valid = true;

    if (!isLogin) {
      if (!checkName()) {
        setNameError('Name must be at least 3 characters and contain no numbers');
        valid = false;
      }
    }

    if (!checkEmail()) {
      setEmailError('Invalid email format');
      valid = false;
    }

    if (!checkPassword()) {
      setPasswordError('Password must be at least 8 characters and contain uppercase, lowercase, number, and special character (@$!%*?&)');
      valid = false;
    }

    if (!valid) return;

    setLoading(true);

    if (isLogin) {
      try {
        await login({ email, password });
        toast.success('Login successful!');
        setName('');
        setEmail('');
        setPassword('');
      } catch (err) {
        const msg = err.message || 'Something went wrong — please try again';
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        await register({ name, email, password });
        toast.success('Account created! Redirecting to login...');
        setName('');
        setEmail('');
        setPassword('');
      } catch (err) {
        const msg = err.message || 'Something went wrong — please try again';
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card
            style={{
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-md)',
              overflow: 'hidden',
            }}
          >
            <Card.Body style={{ padding: 'var(--space-5)' }}>
              <h2
                className="text-center mb-4"
                style={{
                  fontSize: 'var(--font-size-2xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)',
                }}
              >
                Welcome
              </h2>

              <Nav variant="pills" className="justify-content-center mb-4">
                <Nav.Item>
                  <Nav.Link
                    active={isLogin}
                    style={{
                      backgroundColor: isLogin ? 'var(--color-primary)' : 'transparent',
                      color: isLogin ? '#fff' : 'var(--color-primary)',
                      border: '1.5px solid var(--color-primary)',
                      borderRadius: 'var(--radius-full)',
                      padding: '8px 24px',
                      fontWeight: 'var(--font-weight-medium)',
                      fontSize: 'var(--font-size-sm)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                    onClick={() => {
                      setIsLogin(true);
                      setNameError('');
                      setEmailError('');
                      setPasswordError('');
                    }}
                  >
                    Login
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    active={!isLogin}
                    style={{
                      backgroundColor: !isLogin ? 'var(--color-primary)' : 'transparent',
                      color: !isLogin ? '#fff' : 'var(--color-primary)',
                      border: '1.5px solid var(--color-primary)',
                      borderRadius: 'var(--radius-full)',
                      padding: '8px 24px',
                      fontWeight: 'var(--font-weight-medium)',
                      fontSize: 'var(--font-size-sm)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                    onClick={() => {
                      setIsLogin(false);
                      setNameError('');
                      setEmailError('');
                      setPasswordError('');
                    }}
                  >
                    Signup
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              <Form onSubmit={handleSubmit}>
                {!isLogin && (
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                      Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setNameError('');
                      }}
                      placeholder="Enter your name"
                      className="form-control-custom"
                      style={{ borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-base)', borderColor: 'var(--color-border)' }}
                    />
                    {nameError && <small className="text-danger" style={{ fontSize: 'var(--font-size-xs)' }}>{nameError}</small>}
                  </Form.Group>
                )}

                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                    Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError('');
                    }}
                    placeholder="Enter your email"
                    className="form-control-custom"
                    style={{ borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-base)', borderColor: 'var(--color-border)' }}
                  />
                  {emailError && <small className="text-danger" style={{ fontSize: 'var(--font-size-xs)' }}>{emailError}</small>}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                    Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError('');
                    }}
                    placeholder="Enter your password"
                    className="form-control-custom"
                    style={{ borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-base)', borderColor: 'var(--color-border)' }}
                  />
                  {passwordError && <small className="text-danger" style={{ fontSize: 'var(--font-size-xs)' }}>{passwordError}</small>}
                  <small className="text-muted" style={{ fontSize: 'var(--font-size-xs)', display: 'block', marginTop: '4px' }}>
                    Must be at least 8 characters with uppercase, lowercase, number, and special character.
                  </small>
                </Form.Group>

                <LoadingButton
                  type="submit"
                  loading={loading}
                  loadingText={isLogin ? 'Signing in...' : 'Creating account...'}
                  className="w-100 btn-primary-custom"
                >
                  {isLogin ? 'Login' : 'Create Account'}
                </LoadingButton>
              </Form>

              <div className="text-center mt-3">
                <small style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                  {isLogin ? "Don't have an account? " : 'Already have an account? '}
                  <span
                    role="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setNameError('');
                      setEmailError('');
                      setPasswordError('');
                    }}
                    style={{ color: 'var(--color-primary)', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'var(--font-weight-medium)' }}
                  >
                    {isLogin ? 'Sign up' : 'Login'}
                  </span>
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
