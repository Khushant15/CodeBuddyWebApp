const axios = require('axios');
const vm = require('vm');

/**
 * Judge0 Language IDs:
 * Python (3.8.1): 71
 * JavaScript (Node.js 12.14.0): 63
 */
const LANGUAGE_MAP = {
  'python': 71,
  'javascript': 63
};

/**
 * Local Fallback Execution for JavaScript
 */
const localExecuteJs = (code) => {
  let output = "";
  const sandbox = {
    console: {
      log: (...args) => {
        output += args.join(" ") + "\n";
      }
    }
  };

  try {
    const script = new vm.Script(code);
    const context = vm.createContext(sandbox);
    script.runInContext(context, { timeout: 2000 }); // 2s timeout
    return {
      stdout: output.trim(),
      status: { id: 3, description: 'Accepted' },
      time: '0.001',
      memory: 0
    };
  } catch (err) {
    return {
      stderr: err.message,
      status: { id: 11, description: 'Runtime Error' }
    };
  }
};

/**
 * Simulated Execution for Python (Regex-based for simple learners)
 */
const simulatedExecutePython = (code) => {
  // Extract print() values for basic verification
  const printRegex = /print\((?:["'](.*?)["']|(\d+)|(.*?))\)/g;
  let stdout = [];
  let match;

  // Safe Arithmetic Evaluator (No eval() to prevent RCE)
  const safeEval = (str) => {
    // Strictly allow only numbers, whitespace, and basic operators
    if (!/^[\d\s+\-*/ ().]+$/.test(str)) return str;
    try {
      // Use a restricted evaluation pattern that avoids global scope access
      // and only processes basic arithmetic.
      // eslint-disable-next-line no-new-func
      return Function(`"use strict"; return (${str})`)();
    } catch (e) {
      return str;
    }
  };

  while ((match = printRegex.exec(code)) !== null) {
    let val = match[1] || match[2] || match[3] || "";
    
    // Basic Arithmetic Support: if it looks like math, evaluate it safely
    if (val.trim() && /^[\d\s+\-*/().]+$/.test(val.trim())) {
      val = safeEval(val).toString();
    }
    
    stdout.push(val);
  }

  return {
    stdout: stdout.join("\n"),
    status: { id: 3, description: 'Accepted (Simulated)' },
    time: '0.000',
    memory: 0
  };
};

const executeCode = async (code, language = 'python', stdin = "") => {
  const languageId = LANGUAGE_MAP[language.toLowerCase()];
  
  if (!languageId) {
    throw new Error('Unsupported language');
  }

  const apiKey = process.env.RAPIDAPI_KEY;

  // 1. Try RapidAPI Cloud Execution if key is present
  if (apiKey && apiKey !== 'YOUR_RAPID_API_KEY_HERE') {
    const options = {
      method: 'POST',
      url: 'https://judge0-ce.p.rapidapi.com/submissions',
      params: { base64_encoded: 'false', wait: 'true', fields: '*' },
      headers: {
        'content-type': 'application/json',
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      },
      data: {
        source_code: code,
        language_id: languageId,
        stdin: stdin
      }
    };

    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.warn('Judge0 Cloud API Failed. Attempting Local Fallback...', error.message);
    }
  }

  // 2. Local Fallback Mode
  if (language.toLowerCase() === 'javascript') {
    return localExecuteJs(code);
  } else if (language.toLowerCase() === 'python') {
    return simulatedExecutePython(code);
  }

  throw new Error('Execution kernel failure: No local or cloud runner available for this language.');
};

module.exports = { executeCode };
