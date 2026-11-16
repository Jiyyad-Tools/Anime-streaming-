// ==========================================
// INI DI SCRAPE OLEH JIYYAD TOOLS
// CREDIT: https://whatsapp.com/channel/0029VbDOUI04NVinhn4Lvw0r
// ==========================================

import axios from 'axios';

const BASE = 'https://prod-official-dp2.nganime.my.id'; // Endpoint produksi terbaru
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

// === CREDIT CHANNEL ===
const CREDIT_CHANNEL = 'https://whatsapp.com/channel/0029VbDOUI04NVinhn4Lvw0r';
const CREDIT_NAME = 'JIYYAD TOOLS';

// Helper untuk menampilkan credit
function showCredit() {
  console.log('\n' + '='.repeat(50));
  console.log(`🔗 ${CREDIT_NAME} - ${CREDIT_CHANNEL}`);
  console.log('='.repeat(50) + '\n');
}

const client = axios.create({
  baseURL: BASE,
  timeout: 30000,
  headers: {
    'User-Agent': UA,
    'Accept': 'application/json',
  },
});

/* ---------------------------------------------------------------
 * 1. SEARCH ANIME (Meta AniList)
 * ------------------------------------------------------------- */
export async function searchAnime(query, page = 1) {
  if (!query) throw new Error('Query tidak boleh kosong');

  try {
    const { data } = await client.get(`/meta/anilist/${encodeURIComponent(query)}`, {
      params: { page },
    });
    return data;
  } catch (e) {
    throw new Error(`Search gagal: ${e.response?.status || e.message}`);
  }
}

/* ---------------------------------------------------------------
 * 2. DETAIL ANIME
 * ------------------------------------------------------------- */
export async function getAnimeInfo(animeId) {
  if (!animeId) throw new Error('Anime ID tidak boleh kosong');

  try {
    const { data } = await client.get(`/meta/anilist/info/${animeId}`);
    return data;
  } catch (e) {
    throw new Error(`Gagal ambil info: ${e.response?.status || e.message}`);
  }
}

/* ---------------------------------------------------------------
 * 3. EPISODE STREAMING LINKS
 * ------------------------------------------------------------- */
export async function getEpisodeLinks(episodeId) {
  if (!episodeId) throw new Error('Episode ID tidak boleh kosong');

  try {
    const { data } = await client.get(`/meta/anilist/watch/${episodeId}`);
    return data;
  } catch (e) {
    throw new Error(`Gagal ambil link streaming: ${e.response?.status || e.message}`);
  }
}

/* ---------------------------------------------------------------
 * 4. RECENT EPISODES
 * ------------------------------------------------------------- */
export async function getRecentEpisodes(page = 1) {
  try {
    const { data } = await client.get('/recent', {
      params: {
        type: 'anime',
        page,
        perPage: 45,
        fields: 'id,slug,title,currentEpisode,coverImage,episodes',
      },
    });
    return data;
  } catch (e) {
    throw new Error(`Gagal ambil recent: ${e.response?.status || e.message}`);
  }
}

/* ---------------------------------------------------------------
 * 5. TRENDING ANIME
 * ------------------------------------------------------------- */
export async function getTrending(page = 1) {
  try {
    const { data } = await client.get('/meta/anilist/trending', {
      params: { page, perPage: 20 },
    });
    return data;
  } catch (e) {
    try {
      const { data } = await client.get('/meta/anilist/popular', {
        params: { page, perPage: 20 },
      });
      return data;
    } catch (e2) {
      throw new Error(`Gagal ambil trending: ${e2.message}`);
    }
  }
}

/* ---------------------------------------------------------------
 * CLI
 * ------------------------------------------------------------- */
if (import.meta.url === `file://${process.argv[1]}`) {
  const [, , cmd, ...args] = process.argv;
  const arg = args.join(' ');

  const usage = `
usage:
  node nganime.mjs search "judul anime"
  node nganime.mjs info   "<anime-id>"
  node nganime.mjs watch  "<episode-id>"
  node nganime.mjs recent
  node nganime.mjs trending
  
Credit Channel: ${CREDIT_CHANNEL}
  `;

  try {
    if (cmd === 'search') {
      if (!arg) throw new Error(usage);
      showCredit();
      console.log(`Mencari anime: "${arg}"...\n`);
      const res = await searchAnime(arg);
      
      console.log(`Ditemukan ${res.results?.length || 0} anime:`);
      res.results?.forEach((r, i) => {
        console.log(`[${i + 1}] ${r.title?.romaji || r.title?.english || '?'}`);
        console.log(`    ID     : ${r.id}`);
        console.log(`    Format : ${r.type || '-'} | Status: ${r.status || '-'}`);
        console.log(`    Skor   : ${r.rating || '-'}`);
        console.log('');
      });
      showCredit();
    } 
    else if (cmd === 'info') {
      if (!arg) throw new Error(usage);
      showCredit();
      console.log(`Mengambil info anime ID: ${arg}...\n`);
      const res = await getAnimeInfo(arg);
      
      console.log(`=== ${res.title?.romaji || res.title?.english} ===`);
      console.log(`Gambar    : ${res.image || res.cover || '-'}`);
      console.log(`Genre     : ${res.genres?.join(', ') || '-'}`);
      console.log(`Total Ep  : ${res.totalEpisodes || '-'}`);
      console.log(`Status    : ${res.status || '-'}`);
      console.log(`\nDeskripsi : ${res.description?.substring(0, 200) || '-'}...`);
      console.log(`\nDaftar Episode (${res.episodes?.length || 0}):`);
      res.episodes?.slice(0, 10).forEach((ep, i) => {
        console.log(`  [${i + 1}] Episode ${ep.number} - ID: ${ep.id}`);
      });
      if (res.episodes?.length > 10) console.log(`  ... dan ${res.episodes.length - 10} episode lainnya.`);
      showCredit();
    } 
    else if (cmd === 'watch') {
      if (!arg) throw new Error(usage);
      showCredit();
      console.log(`Mengambil link streaming: ${arg}...\n`);
      const res = await getEpisodeLinks(arg);
      
      console.log('Headers:', JSON.stringify(res.headers, null, 2));
      console.log('\nSources:');
      res.sources?.forEach((src, i) => {
        console.log(`  [${i + 1}] ${src.quality} - ${src.isM3U8 ? 'HLS' : 'MP4'}`);
        console.log(`      ${src.url}`);
      });
      if (res.download) console.log(`\nDownload: ${res.download}`);
      showCredit();
    } 
    else if (cmd === 'recent') {
      showCredit();
      console.log('Mengambil episode terbaru...\n');
      const res = await getRecentEpisodes();
      res.results?.forEach((ep, i) => {
        console.log(`[${i + 1}] ${ep.title?.romaji || ep.title?.english || ep.title}`);
        console.log(`    Episode: ${ep.currentEpisode || '-'}`);
        console.log(`    ID     : ${ep.id}\n`);
      });
      showCredit();
    } 
    else if (cmd === 'trending') {
      showCredit();
      console.log('Mengambil trending anime...\n');
      const res = await getTrending();
      res.results?.forEach((anime, i) => {
        console.log(`[${i + 1}] ${anime.title?.romaji || anime.title?.english}`);
        console.log(`    ID: ${anime.id}\n`);
      });
      showCredit();
    } 
    else {
      console.error(usage);
      process.exit(1);
    }
  } catch (e) {
    console.error('\nError:', e.message);
    showCredit();
    process.exit(1);
  }
}
