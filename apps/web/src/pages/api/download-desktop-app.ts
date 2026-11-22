import type { APIRoute } from 'astro'

const GITHUB_REPO = 'TheStableFoundation/notwallet'

interface GitHubAsset {
  id: number
  name: string
  size: number
  browser_download_url: string
  content_type: string
}

interface GitHubRelease {
  tag_name: string
  name: string
  published_at: string
  assets: GitHubAsset[]
}

interface PlatformDownload {
  platform: string
  arch?: string
  filename: string
  size: number
  downloadUrl: string
}

interface DownloadsResponse {
  version: string
  published_at: string
  downloads: {
    macos: PlatformDownload[]
    windows: PlatformDownload[]
    linux: PlatformDownload[]
  }
}

const platformPatterns = {
  macos: {
    apple: /aarch64|arm64/i,
    intel: /x64|x86_64|intel/i,
    universal: /universal/i,
  },
  windows: {
    x64: /win.*x64|windows.*x64|win.*setup|x64.*\.exe|x64.*\.msi/i,
    arm64: /win.*arm64|windows.*arm64|arm64.*\.exe/i,
  },
  linux: {
    x64: /linux.*x64|x86_64|\.AppImage$|\.deb$|\.rpm$/i,
    arm64: /linux.*arm64|linux.*aarch64|aarch64.*\.rpm/i,
  },
}

function categorizeAsset(asset: GitHubAsset): PlatformDownload | null {
  const filename = asset.name
  const lower = filename.toLowerCase()

  // macOS
  if (lower.includes('mac') || lower.includes('darwin') || lower.endsWith('.dmg')) {
    let arch = 'Universal'
    if (platformPatterns.macos.apple.test(filename)) {
      arch = 'Apple Silicon'
    } else if (platformPatterns.macos.intel.test(filename)) {
      arch = 'Intel'
    } else if (platformPatterns.macos.universal.test(filename)) {
      arch = 'Universal'
    }
    return {
      platform: 'macos',
      arch,
      filename,
      size: asset.size,
      downloadUrl: asset.browser_download_url,
    }
  }

  // Windows
  if (lower.includes('win') || lower.endsWith('.exe') || lower.endsWith('.msi')) {
    const arch = platformPatterns.windows.arm64.test(filename) ? 'ARM64' : 'x64'
    return {
      platform: 'windows',
      arch,
      filename,
      size: asset.size,
      downloadUrl: asset.browser_download_url,
    }
  }

  // Linux
  if (
    lower.includes('linux') ||
    lower.endsWith('.appimage') ||
    lower.endsWith('.deb') ||
    lower.endsWith('.rpm')
  ) {
    const arch = platformPatterns.linux.arm64.test(filename) ? 'ARM64' : 'x64'
    return {
      platform: 'linux',
      arch,
      filename,
      size: asset.size,
      downloadUrl: asset.browser_download_url,
    }
  }

  return null
}

export const GET: APIRoute = async () => {
  try {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`, {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const release: GitHubRelease = await response.json()

    const downloads: DownloadsResponse = {
      version: release.tag_name,
      published_at: release.published_at,
      downloads: {
        macos: [],
        windows: [],
        linux: [],
      },
    }

    // Categorize assets
    for (const asset of release.assets) {
      const categorized = categorizeAsset(asset)
      if (categorized) {
        if (categorized.platform === 'macos') {
          downloads.downloads.macos.push(categorized)
        } else if (categorized.platform === 'windows') {
          downloads.downloads.windows.push(categorized)
        } else if (categorized.platform === 'linux') {
          downloads.downloads.linux.push(categorized)
        }
      }
    }

    return new Response(JSON.stringify(downloads), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Error fetching releases:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch releases' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
