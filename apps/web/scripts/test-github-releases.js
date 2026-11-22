#!/usr/bin/env node

/**
 * Test script to verify GitHub releases API access for NotWallet
 * Usage: node scripts/test-github-releases.js
 */

const GITHUB_REPO = 'TheStableFoundation/notwallet'

async function testGitHubReleases() {
  console.log('🔍 Testing GitHub Releases API Access...\n')
  console.log('📦 Repository:', GITHUB_REPO)
  console.log('🌐 Public repository - no authentication required\n')

  try {
    // Test latest release
    console.log('🌐 Fetching latest release...')
    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`, {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    })

    if (!response.ok) {
      console.error(`❌ GitHub API Error: ${response.status} ${response.statusText}`)
      const errorBody = await response.text()
      console.error('Response:', errorBody)
      process.exit(1)
    }

    const release = await response.json()

    console.log('✅ Successfully fetched release!\n')
    console.log('📋 Release Details:')
    console.log('  Version:', release.tag_name)
    console.log('  Name:', release.name)
    console.log('  Published:', new Date(release.published_at).toLocaleString())
    console.log('  Assets:', release.assets.length)
    console.log('')

    // Categorize assets
    const downloads = {
      macos: [],
      windows: [],
      linux: [],
      other: [],
    }

    release.assets.forEach((asset) => {
      const name = asset.name.toLowerCase()
      let category = 'other'

      if (name.includes('mac') || name.endsWith('.dmg')) {
        category = 'macos'
      } else if (name.includes('win') || name.endsWith('.exe') || name.endsWith('.msi')) {
        category = 'windows'
      } else if (
        name.includes('linux') ||
        name.endsWith('.appimage') ||
        name.endsWith('.deb') ||
        name.endsWith('.rpm')
      ) {
        category = 'linux'
      }

      downloads[category].push({
        name: asset.name,
        size: formatFileSize(asset.size),
        url: asset.browser_download_url,
      })
    })

    // Display categorized assets
    console.log('📦 Assets by Platform:\n')

    if (downloads.macos.length > 0) {
      console.log('  🍎 macOS:')
      downloads.macos.forEach((a) => {
        console.log(`    - ${a.name} (${a.size})`)
      })
      console.log('')
    }

    if (downloads.windows.length > 0) {
      console.log('  🪟 Windows:')
      downloads.windows.forEach((a) => {
        console.log(`    - ${a.name} (${a.size})`)
      })
      console.log('')
    }

    if (downloads.linux.length > 0) {
      console.log('  🐧 Linux:')
      downloads.linux.forEach((a) => {
        console.log(`    - ${a.name} (${a.size})`)
      })
      console.log('')
    }

    if (downloads.other.length > 0) {
      console.log('  📄 Other:')
      downloads.other.forEach((a) => {
        console.log(`    - ${a.name} (${a.size})`)
      })
      console.log('')
    }

    // Check API rate limit
    const rateLimitResponse = await fetch('https://api.github.com/rate_limit', {
      headers: {
        Accept: 'application/vnd.github+json',
      },
    })

    if (rateLimitResponse.ok) {
      const rateLimit = await rateLimitResponse.json()
      const core = rateLimit.resources.core
      console.log('📊 API Rate Limit:')
      console.log(`  Used: ${core.used} / ${core.limit}`)
      console.log(`  Remaining: ${core.remaining}`)
      console.log(`  Resets: ${new Date(core.reset * 1000).toLocaleTimeString()}`)
      console.log('')
    }

    console.log('✅ All tests passed!')
    console.log('\n💡 Next steps:')
    console.log('  1. Start dev server: npm run dev')
    console.log('  2. Visit: http://localhost:4321/#download')
    console.log('  3. Desktop installers should appear below app store badges')
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

// Run the test
testGitHubReleases()
