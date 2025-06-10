import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Snackbar,
  Stack,
  Card,
  CardContent,
  Grid,
  Divider,
  Chip,
  Tooltip,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';
import TimelineIcon from '@mui/icons-material/Timeline';
import BarChartIcon from '@mui/icons-material/BarChart';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [acceptanceRate, setAcceptanceRate] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const timeframes = [
    'Thirty Days',
    'Three Months',
    'Six Months',
    'One Year'
  ];

  const cardColors = [
    'linear-gradient(135deg, #f8fafc 60%, #e3f2fd 100%)',
    'linear-gradient(135deg, #fffde7 60%, #ffe082 100%)',
    'linear-gradient(135deg, #f3e5f5 60%, #ce93d8 100%)',
    'linear-gradient(135deg, #e8f5e9 60%, #a5d6a7 100%)',
    'linear-gradient(135deg, #fff3e0 60%, #ffb74d 100%)',
    'linear-gradient(135deg, #e1f5fe 60%, #4fc3f7 100%)',
    'linear-gradient(135deg, #fbe9e7 60%, #ff8a65 100%)'
  ];

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setError(null);
        const response = await axios.get(`${API_BASE_URL}/companies`);
        setCompanies(response.data);
      } catch (error) {
        setError(error.response?.data?.details || error.response?.data?.error || 'Failed to fetch companies');
      }
    };
    fetchCompanies();
  }, []);

  const handleSearch = async () => {
    if (!selectedCompany || !selectedTimeframe) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (difficulty) params.append('difficulty', difficulty);
      if (acceptanceRate) params.append('acceptanceRate', acceptanceRate);
      const response = await axios.get(
        `${API_BASE_URL}/questions/${selectedCompany}/${selectedTimeframe}?${params}`
      );
      setQuestions(response.data);
    } catch (error) {
      setError(error.response?.data?.details || error.response?.data?.error || 'Failed to fetch questions');
      setQuestions([]);
    }
    setLoading(false);
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Hero Header */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 6, mb: 4, boxShadow: 2 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <img src="/algo_logo.jpeg" alt="Logo" style={{ height: 48, marginRight: 16 }} />
            <Typography variant="h2" component="h1" gutterBottom align="center" fontWeight={700}>
              Company DSA Questions
            </Typography>
          </Box>
          <Typography variant="h5" align="center" sx={{ opacity: 0.9 }}>
            Instantly search and filter LeetCode questions by company, timeframe, and difficulty
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ flex: 1 }}>
        {/* Search Card */}
        <Card sx={{ mb: 4, p: 2, boxShadow: 4 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel><BusinessIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Company</InputLabel>
                  <Select
                    value={selectedCompany}
                    label="Company"
                    onChange={(e) => setSelectedCompany(e.target.value)}
                  >
                    {companies.map((company) => (
                      <MenuItem key={company} value={company}>
                        {company}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel><TimelineIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Timeframe</InputLabel>
                  <Select
                    value={selectedTimeframe}
                    label="Timeframe"
                    onChange={(e) => setSelectedTimeframe(e.target.value)}
                  >
                    {timeframes.map((timeframe) => (
                      <MenuItem key={timeframe} value={timeframe}>
                        {timeframe}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Difficulty</InputLabel>
                  <Select
                    value={difficulty}
                    label="Difficulty"
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    <MenuItem value="">Any</MenuItem>
                    <MenuItem value="Easy">Easy</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Hard">Hard</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  label={<><BarChartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Min Acceptance Rate</>}
                  type="number"
                  value={acceptanceRate}
                  onChange={(e) => setAcceptanceRate(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleSearch}
                  disabled={!selectedCompany || !selectedTimeframe}
                  fullWidth
                  size="large"
                  startIcon={<SearchIcon />}
                  sx={{ height: '56px' }}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Results Display */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
            <CircularProgress size={60} />
          </Box>
        ) : questions.length > 0 ? (
          <Grid container spacing={3}>
            {questions.map((question, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: 6,
                    borderRadius: 3,
                    border: '1.5px solid #e3e8ee',
                    background: cardColors[index % cardColors.length],
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-6px) scale(1.03)',
                      boxShadow: 12,
                      borderColor: '#90caf9',
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" sx={{ flexGrow: 1 }} noWrap>
                        <a
                          href={question.Link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 500 }}
                        >
                          {question.Title}
                        </a>
                        <IconButton
                          href={question.Link}
                          target="_blank"
                          rel="noopener noreferrer"
                          size="small"
                          sx={{ ml: 1 }}
                        >
                          <OpenInNewIcon fontSize="small" />
                        </IconButton>
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Chip
                        label={question.Difficulty}
                        color={
                          question.Difficulty === 'Easy'
                            ? 'success'
                            : question.Difficulty === 'Medium'
                            ? 'warning'
                            : 'error'
                        }
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Chip
                        icon={<BarChartIcon />}
                        label={`Acceptance: ${parseFloat(question['Acceptance Rate']).toFixed(2)}`}
                        color="primary"
                        size="small"
                      />
                      <Chip
                        label={`Frequency: ${question.Frequency}`}
                        color="secondary"
                        size="small"
                      />
                    </Box>
                    <Tooltip title={question.Topics}>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {question.Topics}
                      </Typography>
                    </Tooltip>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', my: 6 }}>
            <Typography variant="h6" color="text.secondary">
              {selectedCompany && selectedTimeframe && !loading ? 'No questions found for the selected filters.' : 'Select a company and timeframe to view questions.'}
            </Typography>
          </Box>
        )}

        {/* Error Snackbar */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={handleCloseError}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.200', py: 3, mt: 6 }}>
        <Container maxWidth="md">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} DSA Company Questions | Built by <a href="https://github.com/paras1105tyagi" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', fontWeight: 500 }}>paras1105tyagi</a>
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default App; 