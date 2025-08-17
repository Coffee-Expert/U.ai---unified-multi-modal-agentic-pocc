import React, { useEffect } from 'react';
import { Box, Typography, Grid, Container, Button, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './LandingPage.scss';

const services = [
  {
    title: 'Unified Chatbot Assistant',
    description: 'Your command center for intelligent actions.',
    features: [
      'Chat with PDFs or audio files',
      'Ask questions from uploaded videos',
      'Trigger backend operations',
    ],
    gradient: 'linear-gradient(135deg, #42a5f5, #5e35b1)',
  },
  {
    title: 'Patch Management Agent',
    description: 'Automate Windows patch updates like a pro.',
    features: ['Agent-based detection', 'Remote PowerShell', 'EC2 & WinRM integration'],
    gradient: 'linear-gradient(135deg, #7b1fa2, #1e88e5)',
  },
  {
    title: 'Voice Command Agent',
    description: 'Talk to your system. Literally.',
    features: ['Restart servers', 'Retrieve logs', 'Run PowerShell commands'],
    gradient: 'linear-gradient(135deg, #3949ab, #8e24aa)',
  },
  {
    title: 'LLaMA-Powered Insights',
    description: 'Integrate your own LLaMA API key for local inference.',
    features: [
      'Local API key integration',
      'Full privacy and control',
      'Optimized local inference',
    ],
    gradient: 'linear-gradient(135deg, #ff7043, #f4511e)',
  },
];

const steps = [
  'Input your LLaMA API key securely',
  'Select or upload files/media',
  'Ask questions or trigger actions',
  'Receive intelligent responses or execute tasks',
];

const LandingPage = () => {
  const navigate = useNavigate();

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6 },
    }),
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <Box className="landing-root">
      {/* Hero */}
      <motion.div
        className="hero"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        custom={0}
      >
        <Typography variant="h1" className="hero-title">
          Meet Your <span>AI Control Room</span>
        </Typography>
        <Typography variant="subtitle1" className="hero-sub">
          Command PDFs, videos, servers, and systems — from a single dashboard.
        </Typography>
        <Box className="hero-buttons">
          <Button variant="contained" onClick={() => navigate('/main')}>
            Launch App
          </Button>
          <Button variant="outlined" href="#features">
            Explore Features
          </Button>
        </Box>
        <Box className="hero-animation">
          <img src="/assets/hero-ui-preview.gif" alt="UI Preview" />
        </Box>
      </motion.div>

      {/* Features */}
      <Container className="services fade-in" id="features">
        <Typography variant="h3" align="center">Explore Capabilities</Typography>
        <Grid container spacing={4} className="services-grid">
          {services.map((svc, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <motion.div
                className="feature-card"
                style={{ background: svc.gradient }}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={idx}
              >
                <Typography variant="h6">{svc.title}</Typography>
                <Typography variant="body2">{svc.description}</Typography>
                <ul>
                  {svc.features.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works */}
      <Container className="how-it-works fade-in">
        <Typography variant="h3" align="center">How It Works</Typography>
        <Box className="timeline">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="timeline-step"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
            >
              <Typography className="step-index">{`Step ${i + 1}`}</Typography>
              <Typography className="step-text">{step}</Typography>
            </motion.div>
          ))}
        </Box>
      </Container>

      {/* Screenshots */}
      <Container className="screenshots fade-in">
        <Typography variant="h3" textAlign="center">Sneak Peek</Typography>
        <Slider {...sliderSettings}>
          {['screen1.png', 'screen2.png', 'screen3.png'].map((img, i) => (
            <Box key={i} className="carousel-img">
              <img src={`/assets/${img}`} alt={`Screenshot ${i + 1}`} />
            </Box>
          ))}
        </Slider>
      </Container>

      {/* Trust Section */}
      <Container className="trust-section fade-in">
        <Typography variant="h4" align="center">Built by Developers, for Developers</Typography>
        <Grid container justifyContent="center" spacing={4}>
          {['logo-openai.svg', 'logo-aws.svg', 'logo-llama.svg'].map((logo, i) => (
            <Grid item key={i}><img src={`/assets/${logo}`} alt={`Logo ${i + 1}`} height="60" /></Grid>
          ))}
        </Grid>
      </Container>

      {/* Newsletter */}
      <Box className="newsletter fade-in">
        <Typography variant="h4">Stay in the Loop</Typography>
        <Typography>Get updates about new agent integrations and demos.</Typography>
        <form>
          <input type="email" placeholder="you@example.com" />
          <button type="submit">Subscribe</button>
        </form>
      </Box>

      {/* Footer */}
      <Box className="footer">
        <Typography>© 2025 Unified AI Agent Hub</Typography>
        <Box mt={1}>
          <Link href="#">Tool</Link>
          <Link href="#">Documentation</Link>
        </Box>
      </Box>
    </Box>
  );
};

export default LandingPage;
