module.exports = {
  apps: [{
    name: 'thai-boxer-companion',
    script: 'server_dist/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    env_file: '.env'
  }]
};
