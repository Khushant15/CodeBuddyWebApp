/**
 * Core validation logic to compare user results against expected outputs.
 * Handles whitespace trimming and basic string normalization.
 */
const validateResult = (actual, expected) => {
  if (!actual && expected) return false;
  
  // Normalize by trimming and removing trailing newlines
  const normalizedActual = actual.toString().trim().replace(/\r\n/g, '\n');
  const normalizedExpected = expected.toString().trim().replace(/\r\n/g, '\n');

  return normalizedActual === normalizedExpected;
};

const runTestCases = async (executeFn, code, language, testCases) => {
  const results = [];
  let allPassed = true;

  for (let i = 0; i < testCases.length; i++) {
    const { input, expected, isPublic } = testCases[i];
    
    try {
      const execResult = await executeFn(code, language, input);
      const passed = validateResult(execResult.stdout || "", expected);
      
      if (!passed) allPassed = false;

      results.push({
        testCaseIndex: i,
        passed,
        input: isPublic ? input : "[HIDDEN]",
        expected: isPublic ? expected : "[HIDDEN]",
        actual: isPublic ? (execResult.stdout || execResult.stderr || "No Output") : (passed ? "[MATCH]" : "[MISMATCH]"),
        error: execResult.stderr || execResult.compile_output || null
      });
    } catch (err) {
      allPassed = false;
      results.push({
        testCaseIndex: i,
        passed: false,
        input: isPublic ? input : "[HIDDEN]",
        error: "Execution Error: " + err.message
      });
    }
  }

  return { allPassed, results };
};

module.exports = { validateResult, runTestCases };
