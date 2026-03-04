import fs from 'fs';

async function restore() {
  try {
    const url = "https://raw.githubusercontent.com/atutik1312-web/eco-stroy/refs/heads/main/src/assets/hero-bg-2.jpg?token=GHSAT0AAAAAADWHX4UJJM4JRZYXSTE5BSY62NCBA4A";
    const res = await fetch(url);
    
    if (res.ok) {
      const buffer = await res.arrayBuffer();
      fs.writeFileSync('src/assets/hero-bg-2.jpg', Buffer.from(buffer));
      console.log("Downloaded and restored src/assets/hero-bg-2.jpg with token!");
    } else {
      console.log("Failed to download image with token. Status:", res.status);
      const text = await res.text();
      console.log("Response:", text);
    }
  } catch (e) {
    console.error("Error:", e);
  }
}

restore();
