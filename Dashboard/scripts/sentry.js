const SentryCli = require('@sentry/cli');
const crypto = require('crypto');

async function createReleaseAndUpload() {
    const release = process.env.RELEASE;
    if (!release) {
        console.warn('RELEASE env var is not set');
        process.exit(1);
    }

    try {
        // const release = crypto.randomUUID();

        const cli = new SentryCli();

        console.log('Creating sentry release ' + release);
        await cli.releases.new(release);

        console.log('Uploading source maps');
        await cli.releases.uploadSourceMaps(release, {
            include: ['build/static/js'],
            urlPrefix: '~/static/js',
            rewrite: false,
        });

        console.log('Finalizing release');
        await cli.releases.finalize(release);
    } catch (e) {
        console.error('Source maps uploading failed:', e);
    }
}

createReleaseAndUpload();
