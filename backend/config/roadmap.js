// c:\Users\Administrator\OneDrive\Desktop\Projects\codebuddy_final\codebuddy\backend\config\roadmap.js
const ROADMAP_STRUCTURE = [
  {
    topic: 'html',
    name: 'HTML Essentials',
    levels: [
      { id: 'html-beg', name: 'Beginner', nodes: ['html-structure', 'html-tags'] },
      { id: 'html-int', name: 'Intermediate', nodes: ['html-forms', 'html-semantic'] },
      { id: 'html-pro', name: 'Professional', nodes: ['html-seo', 'html-accessibility'] }
    ]
  },
  {
    topic: 'css',
    name: 'CSS Mastery',
    levels: [
      { id: 'css-beg', name: 'Beginner', nodes: ['css-selectors', 'css-boxmodel'] },
      { id: 'css-int', name: 'Intermediate', nodes: ['css-flexbox', 'css-grid'] },
      { id: 'css-pro', name: 'Professional', nodes: ['css-animations', 'css-responsive'] }
    ]
  },
  {
    topic: 'python',
    name: 'Python Development',
    levels: [
      { id: 'python-beg', name: 'Beginner', nodes: ['python-variables', 'python-operators'] },
      { id: 'python-int', name: 'Intermediate', nodes: ['python-conditionals', 'python-loops'] },
      { id: 'python-pro', name: 'Professional', nodes: ['python-oop', 'python-files'] }
    ]
  },
  {
    topic: 'javascript',
    name: 'JavaScript Logic',
    levels: [
      { id: 'js-beg', name: 'Beginner', nodes: ['js-basics', 'js-functions'] },
      { id: 'js-int', name: 'Intermediate', nodes: ['js-async', 'js-dom'] },
      { id: 'js-pro', name: 'Professional', nodes: ['js-es6', 'js-performance'] }
    ]
  },
  {
    topic: 'react',
    name: 'React UI',
    levels: [
      { id: 'react-beg', name: 'Beginner', nodes: ['react-components', 'react-props'] },
      { id: 'react-int', name: 'Intermediate', nodes: ['react-hooks', 'react-router'] },
      { id: 'react-pro', name: 'Professional', nodes: ['react-context', 'react-performance'] }
    ]
  },
  {
    topic: 'node',
    name: 'Node.js Backend',
    levels: [
      { id: 'node-beg', name: 'Beginner', nodes: ['node-basics', 'node-modules'] },
      { id: 'node-int', name: 'Intermediate', nodes: ['node-express', 'node-mongodb'] },
      { id: 'node-pro', name: 'Professional', nodes: ['node-auth', 'node-streams'] }
    ]
  },
  {
    topic: 'dsa',
    name: 'Data Structures',
    levels: [
      { id: 'dsa-beg', name: 'Beginner', nodes: ['dsa-arrays', 'dsa-strings'] },
      { id: 'dsa-int', name: 'Intermediate', nodes: ['dsa-stacks', 'dsa-queues'] },
      { id: 'dsa-pro', name: 'Professional', nodes: ['dsa-trees', 'dsa-graphs'] }
    ]
  }
];

module.exports = ROADMAP_STRUCTURE;
