const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { parse } = require('csv-parse/sync');
const { Octokit } = require('@octokit/rest');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Octokit
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

// Get list of companies (folders)
app.get('/api/companies', async (req, res) => {
  try {
    const response = await octokit.repos.getContent({
      owner: 'paras1105tyagi',
      repo: 'leetcode-company-wise-problems',
      path: '',
      ref: 'main'
    });

    const companies = response.data
      .filter(item => item.type === 'dir')
      .map(item => item.name);

    res.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch companies',
      details: error.response?.data?.message || error.message
    });
  }
});

// Get questions for a specific company and timeframe
app.get('/api/questions/:company/:timeframe', async (req, res) => {
  try {
    const { company, timeframe } = req.params;
    const { difficulty, acceptanceRate } = req.query;

    const timeframeMapping = {
      "Thirty Days": "1. Thirty Days.csv",
      "Three Months": "2. Three Months.csv",
      "Six Months": "3. Six Months.csv",
    //   "More Than Six Months": "4. More Than Six Months.csv",
      "One Year": "5. All.csv"
    };

    const csvFilename = timeframeMapping[timeframe];
    if (!csvFilename) {
      return res.status(400).json({ error: 'Invalid timeframe' });
    }

    const response = await octokit.repos.getContent({
      owner: 'paras1105tyagi',
      repo: 'leetcode-company-wise-problems',
      path: `${company}/${csvFilename}`,
      ref: 'main'
    });

    if (!response.data || !response.data.content) {
      throw new Error('Invalid CSV content from GitHub');
    }

    const csvContent = Buffer.from(response.data.content, 'base64').toString();

    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true
    });

    let filteredRecords = records;
    if (difficulty) {
      filteredRecords = filteredRecords.filter(record =>
        record.Difficulty && record.Difficulty.toLowerCase() === difficulty.toLowerCase()
      );
    }

    if (acceptanceRate) {
      filteredRecords = filteredRecords.filter(record =>
        record['Acceptance Rate'] && parseFloat(record['Acceptance Rate']) >= parseFloat(acceptanceRate)
      );
    }

    if (filteredRecords.length === 0) {
      return res.status(404).json({ error: 'No questions match the selected filters' });
    }

    res.json(filteredRecords);
  } catch (error) {
    console.error('Error fetching questions:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch questions',
      details: error.response?.data?.message || error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
