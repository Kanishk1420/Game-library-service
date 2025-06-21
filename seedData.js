const mongoose = require('mongoose');
const Game = require('./models/Game');
require('dotenv').config();

const sampleGames = [
  {
    title: "The Witcher 3: Wild Hunt",
    platforms: ["PC", "PlayStation", "Xbox", "Nintendo"],
    genre: ["RPG", "Open World", "Action"],
    developer: "CD Projekt Red",
    publisher: "CD Projekt",
    releaseDate: new Date("2015-05-19"),
    description: "An action role-playing game set in an open world fantasy universe.",
    coverImage: "https://cdn1.epicgames.com/offer/14ee004dadc142faaaece5a6270fb628/EGS_TheWitcher3WildHuntCompleteEdition_CDPROJEKTRED_S2_1200x1600-53a8fb2c0201cd8aea410f2a049aba3f",
    screenshots: ["https://rukminim2.flixcart.com/image/750/900/av-media/games/n/w/a/the-witcher-3-wild-hunt-original-imae4pn2ghwfefyw.jpeg?q=90&crop=false", "https://img.redbull.com/images/c_fill,g_auto,w_1200,h_630/f_auto,q_auto/redbullcom/2015/04/30/1331720269195_2/the-witcher-3-video-game-screen-grab","https://i.ytimg.com/vi/xx8kQ4s5hCY/maxresdefault.jpg","https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/292030/ss_608af6cfe0eab3f37265550b391732a3e88d1a4f.1920x1080.jpg?t=1749199563","https://doomrocket.com/wp-content/uploads/2015/05/witcher-3-wild-hunt-promo-art.jpg"],
    systemRequirements: {
      minimum: {
        os: "Windows 7",
        processor: "Intel Core i5-2500K",
        memory: "6 GB RAM",
        graphics: "NVIDIA GeForce GTX 660",
        storage: "35 GB"
      },
      recommended: {
        os: "Windows 10",
        processor: "Intel Core i7-3770",
        memory: "8 GB RAM",
        graphics: "NVIDIA GeForce GTX 770",
        storage: "35 GB"
      }
    },
    price: {
      amount: 39.99,
      currency: "USD"
    },
    rating: 9.3,
    dlc: [
  {
    title: "Hearts of Stone",
    description: "A 10-hour adventure where you'll cross paths with the enigmatic Man of Glass",
    releaseDate: new Date("2015-10-13")
  },
  {
    title: "Blood and Wine",
    description: "A 20+ hour adventure in the all-new region of Toussaint",
    releaseDate: new Date("2016-05-31")
  }
]
  },
  {
    title: "Elden Ring",
    platforms: ["PC", "PlayStation", "Xbox"],
    genre: ["Action RPG", "Open World"],
    developer: "FromSoftware",
    publisher: "Bandai Namco",
    releaseDate: new Date("2022-02-25"),
    description: "An action RPG developed by FromSoftware and written by George R. R. Martin.",
    coverImage: "https://image.api.playstation.com/vulcan/img/rnd/202111/0506/hcFeWRVGHYK72uOw6Mn6f4Ms.jpg",
    screenshots: ["https://www.dsogaming.com/wp-content/uploads/2021/08/Elden-Ring-new-screenshots-1.jpg", "https://preview.redd.it/my-favorite-elden-ring-screenshot-v0-6tfcf335bu2d1.jpeg?width=1080&crop=smart&auto=webp&s=cce9ac3cf1e37ee8afc3798e67cbc7f7fbb20ab5","https://static0.gamerantimages.com/wordpress/wp-content/uploads/2021/08/elden-ring-automaton-screenshot-feature.jpg","https://www.gematsu.com/wp-content/uploads/2021/08/Elden-Ring_2021_08-27-21_001.jpg","https://static0.gamerantimages.com/wordpress/wp-content/uploads/2023/05/elden-ring-saved-by-blaidd-during-radahn-fight.jpg"],
    systemRequirements: {
      minimum: {
        os: "Windows 10",
        processor: "Intel Core i5-8400",
        memory: "12 GB RAM",
        graphics: "NVIDIA GeForce GTX 1060",
        storage: "60 GB"
      },
      recommended: {
        os: "Windows 10/11",
        processor: "Intel Core i7-8700K",
        memory: "16 GB RAM",
        graphics: "NVIDIA GeForce GTX 1070",
        storage: "60 GB"
      }
    },
    price: {
      amount: 59.99,
      currency: "USD"
    },
    rating: 9.5,
    dlc: [
  {
    title: "Shadow of the Erdtree",
    description: "A major expansion exploring the Land of Shadow, guided by Miquella",
    releaseDate: new Date("2024-06-21")
  }
]
  },
  {
    title: "Among Us",
    platforms: ["PC", "Mobile"],
    genre: ["Social Deduction", "Multiplayer"],
    developer: "InnerSloth",
    publisher: "InnerSloth",
    releaseDate: new Date("2018-06-15"),
    description: "A multiplayer game about completing tasks while finding the impostor among the crew.",
    coverImage: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9a/Among_Us_cover_art.jpg/250px-Among_Us_cover_art.jpg",
    screenshots: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7E5E_aBOSujDj4Ctm7IFDuyPocW_J7zId-g&s", "https://i.insider.com/5fe2fb7bedf89200180936d9?width=700","https://preview.redd.it/my-take-on-an-among-us-board-game-critiques-welcome-v0-9buod07rdvgc1.png?width=9751&format=png&auto=webp&s=9bba75a2554054ac3b7f32620434917d26f303e4","https://cdn.shopify.com/s/files/1/0084/2412/files/among_us_480x480.png?v=1609256084"],
    price: {
      amount: 0,
      currency: "USD"
    },
    rating: 8.7
  },
  {
    title: "The Legend of Zelda: Breath of the Wild",
    platforms: ["Nintendo"],
    genre: ["Action-Adventure", "Open World"],
    developer: "Nintendo",
    publisher: "Nintendo",
    releaseDate: new Date("2017-03-03"),
    description: "An action-adventure game developed and published by Nintendo for the Switch and Wii U consoles.",
    coverImage: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c6/The_Legend_of_Zelda_Breath_of_the_Wild.jpg/250px-The_Legend_of_Zelda_Breath_of_the_Wild.jpg",
    screenshots: ["https://img.goodfon.com/wallpaper/big/9/38/the-legend-of-zelda-breath-of-the-wild-nintendo-game-link-2.webp", "https://www.vice.com/wp-content/uploads/sites/2/2017/02/1487942076700-rsz_1the_legend_of_zelda_-_breath_of_the_wild_screenshot___4__.jpeg","https://jgeekstudies.org/wp-content/uploads/2024/10/cudennec_2024_fig2.jpg","https://cdn.mos.cms.futurecdn.net/39G8xHKsrZxX6SszLvggdM.jpg","https://i0.wp.com/thecypressonline.com/wp-content/uploads/2021/01/2020112120390600-58651EB6190D84545B23A9E085BB315E.jpg?fit=900%2C506&ssl=1"],
    price: {
      amount: 59.99,
      currency: "USD"
    },
    rating: 9.7
  },
  {
  "title": "Halo Infinite",
  "platforms": ["PC", "Xbox"],
  "genre": ["FPS", "Action", "Sci-Fi"],
  "developer": "343 Industries",
  "publisher": "Xbox Game Studios",
  "releaseDate": "2021-12-08",
  "description": "The next entry in the legendary Halo franchise with a new open-world approach.",
  "coverImage": "https://store-images.s-microsoft.com/image/apps.50670.13727851868390641.c9cc5f66-aff8-406c-af6b-440838730be0.d205e025-5444-4eb1-ae46-571ae6895928?q=90&w=480&h=270",
  "screenshots": ["https://content.halocdn.com/media/Default/community/blogs/hi_campaign_sniper_4k-e327d439d8714ed481c5de4b1b7fcc81.png", "https://cdn.wccftech.com/wp-content/uploads/2020/12/Halo-Infinite-Screenshots-7-scaled.jpg","https://images.hothardware.com/contentimages/newsitem/54387/content/small_halo_infinite3.jpg","https://cdn.mos.cms.futurecdn.net/BPkJtK3YY52LC2V3PCPSwY.jpeg","https://i.kinja-img.com/image/upload/c_fit,q_60,w_645/fa36fed82c7f29c6d9892de2ed27cd2a.jpg"],
  "systemRequirements": {
    "minimum": {
      "os": "Windows 10",
      "processor": "AMD FX-8370 or Intel i5-4440",
      "memory": "8 GB RAM",
      "graphics": "AMD RX 570 or Nvidia GTX 1050 Ti",
      "storage": "50 GB"
    },
    "recommended": {
      "os": "Windows 10",
      "processor": "AMD Ryzen 7 3700X or Intel i7-9700k",
      "memory": "16 GB RAM",
      "graphics": "Radeon RX 5700 XT or Nvidia RTX 2070",
      "storage": "50 GB SSD"
    }
  },
  "price": {
    "amount": 59.99,
    "currency": "USD"
  },
  "rating": 8.7
},
{
  title: "Baldur's Gate 3",
  platforms: ["PC", "PlayStation", "Xbox"],
  genre: ["RPG", "Fantasy", "Turn-based"],
  developer: "Larian Studios",
  publisher: "Larian Studios",
  releaseDate: new Date("2023-08-03"),
  description: "A role-playing game that continues the story of the Baldur's Gate series, set in the Dungeons & Dragons universe.",
  coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg",
  screenshots: [
    "https://sm.ign.com/t/ign_ap/gallery/b/baldurs-ga/baldurs-gate-3-gameplay-screenshots_9fud.1200.png",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSHNKKV8yRCtLprsZFj-abl3kMdzUmXKXRPQ&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsvUao3SlvMepQnC5eL6u2WGTI0T_iJ_ta2Q&s",
    "https://cdn.mobygames.com/promos/9488500-baldurs-gate-iii-screenshot.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5SxVRDsH2K0Dt08NJLyDrgJbhmwMXY6RRjw&s"
  ],
  systemRequirements: {
    minimum: {
      os: "Windows 10 64-bit",
      processor: "Intel i5-4690 / AMD FX 8350",
      memory: "8 GB RAM",
      graphics: "NVIDIA GTX 970 / AMD RX 480 (4GB+ VRAM)",
      storage: "150 GB"
    },
    recommended: {
      os: "Windows 10 64-bit",
      processor: "Intel i7-8700K / AMD r5 3600",
      memory: "16 GB RAM",
      graphics: "NVIDIA RTX 2060 Super / AMD RX 5700 XT (8GB+ VRAM)",
      storage: "150 GB SSD"
    }
  },
  price: {
    amount: 59.99,
    currency: "USD"
  },
  rating: 9.5
},
{
  title: "Red Dead Redemption 2",
  platforms: ["PC", "PlayStation", "Xbox"],
  genre: ["Action-Adventure", "Open World", "Western"],
  developer: "Rockstar Games",
  publisher: "Rockstar Games",
  releaseDate: new Date("2018-10-26"),
  description: "An epic tale of life in America's unforgiving heartland, featuring a vast and atmospheric world that provides the foundation for a brand new online multiplayer experience.",
  coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7uLS1dMbHHJRsCW7Im36ITc7JG6n-bamP1g&s",
  screenshots: [
    "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/ss_bac60bacbf5da8945103648c08d27d5e202444ca.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSv54LwAu9EmUKY-xw23eDhYqM2YqrXaVs4Fg&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRQ6_aS5ggL2wqdjv2PIFoswHW8akuvVg2cA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6VZK5rv3vVoJl_Xhxdv9TGpWzSkSpGUSw-A&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR50hZ1-QtAwtNAnjGQinBeO-frA7fQfRV2ZQ&s"
  ],
  systemRequirements: {
    minimum: {
      os: "Windows 10",
      processor: "Intel Core i5-2500K / AMD FX-6300",
      memory: "8 GB RAM",
      graphics: "Nvidia GeForce GTX 770 2GB / AMD Radeon R9 280 3GB",
      storage: "150 GB"
    },
    recommended: {
      os: "Windows 10",
      processor: "Intel Core i7-4770K / AMD Ryzen 5 1500X",
      memory: "12 GB RAM",
      graphics: "Nvidia GeForce GTX 1060 6GB / AMD Radeon RX 480 4GB",
      storage: "150 GB SSD"
    }
  },
  price: {
    amount: 59.99,
    currency: "USD"
  },
  rating: 9.7
},
{
  title: "Minecraft",
  platforms: ["PC", "PlayStation", "Xbox", "Nintendo", "Mobile"],
  genre: ["Sandbox", "Survival", "Adventure"],
  developer: "Mojang Studios",
  publisher: "Mojang Studios",
  releaseDate: new Date("2011-11-18"),
  description: "A sandbox video game that allows players to build and explore virtual worlds made up of blocks.",
  coverImage: "https://www.minecraft.net/content/dam/games/minecraft/key-art/Games_Subnav_Minecraft-300x465.jpg",
  screenshots: [
    "https://preview.redd.it/a-few-screenshots-i-took-while-playing-with-complementary-v0-raztsppudmdd1.png?width=1080&crop=smart&auto=webp&s=980b945a2804212c1ce1b14ff365e251cb716a3e",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFvBDNAqwyggf2oIiAZUvPhHjarTGzK1pD0g&s",
    "https://i.pinimg.com/736x/16/41/24/16412467f92e3dfbbade7a105c2397ba.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSub5I3pvIvOAzazFM6ZbAvVhotv3LEPr9jFg&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvPESV0WynzBi_i8Wm7PYjy19MNqt80GTmUA&s"
  ],
  systemRequirements: {
    minimum: {
      os: "Windows 7 or later",
      processor: "Intel Core i3-3210 / AMD A8-7600",
      memory: "4 GB RAM",
      graphics: "Intel HD Graphics 4000 / AMD Radeon R5",
      storage: "4 GB"
    },
    recommended: {
      os: "Windows 10",
      processor: "Intel Core i5-4690 / AMD A10-7800",
      memory: "8 GB RAM",
      graphics: "NVIDIA GeForce 700 Series / AMD Radeon Rx 200 Series",
      storage: "8 GB SSD"
    }
  },
  price: {
    amount: 26.95,
    currency: "USD"
  },
  rating: 9.4
},
{
  title: "God of War",
  platforms: ["PC", "PlayStation"],
  genre: ["Action-Adventure", "RPG", "Mythology"],
  developer: "Santa Monica Studio",
  publisher: "Sony Interactive Entertainment",
  releaseDate: new Date("2018-04-20"),
  description: "His vengeance against the Gods of Olympus years behind him, Kratos now lives as a man in the realm of Norse Gods and monsters.",
  coverImage: "https://image.api.playstation.com/vulcan/img/rnd/202011/1021/X3WIAh63yKhRRiMohLoJMeQu.png",
  screenshots: [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg1hXtYsK1iDKOEBgoIA456lo-DyuWIYSSbw&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIwNXNFuSYScJCRrZ4uJpMJ2FyFjVxrDGeog&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsHzmAuWkniqb3YtzJHpyEJOlHKBmSGLKeWQ&s",
    "https://platform.polygon.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/10633613/My_Great_Capture_Screenshot_2018_04_02_13_17_17.png?quality=90&strip=all&crop=0,3.2694139185101,100,93.46117216298",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1iVrcPmJygH2DXIx4mcpYvy0KNYzdiZyYVQ&s"
  ],
  systemRequirements: {
    minimum: {
      os: "Windows 10 64-bit",
      processor: "Intel i5-2500K / AMD Ryzen 3 1200",
      memory: "8 GB RAM",
      graphics: "NVIDIA GTX 960 / AMD R9 290X",
      storage: "70 GB"
    },
    recommended: {
      os: "Windows 10 64-bit",
      processor: "Intel i5-6600K / AMD Ryzen 5 2400G",
      memory: "8 GB RAM",
      graphics: "NVIDIA GTX 1060 / AMD RX 570",
      storage: "70 GB SSD"
    }
  },
  price: {
    amount: 49.99,
    currency: "USD"
  },
  rating: 9.8
},
{
  title: "Cyberpunk 2077",
  platforms: ["PC", "PlayStation", "Xbox"],
  genre: ["RPG", "Open World", "Sci-Fi"],
  developer: "CD Projekt Red",
  publisher: "CD Projekt",
  releaseDate: new Date("2020-12-10"),
  description: "An open-world, action-adventure story set in Night City, a megalopolis obsessed with power, glamour and body modification.",
  coverImage: "https://specials-images.forbesimg.com/imageserve/61f695933c4524ba288b8f46/960x0.jpg",
  screenshots: [
    "https://i.redd.it/p02h2jzr2yn51.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTARQpHTeAgxP2MKv5LRL6WzoKW3C8Az73XCA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXbtBV_kFNVV23u_7MUynF9SuNwA5d8LUswA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo4K8iONbKlUQkZNl_ZZWl_gJ8w2R2L2V7zw&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi88zL70XcPdWZhsHz_2mC-ObJRBtDap6TTg&s"
  ],
  systemRequirements: {
    minimum: {
      os: "Windows 10",
      processor: "Intel Core i5-3570K / AMD FX-8310",
      memory: "8 GB RAM",
      graphics: "NVIDIA GTX 970 / AMD Radeon RX 470",
      storage: "70 GB SSD"
    },
    recommended: {
      os: "Windows 10",
      processor: "Intel Core i7-4790 / AMD Ryzen 3 3200G",
      memory: "12 GB RAM",
      graphics: "NVIDIA GTX 1060 6GB / AMD Radeon RX 590",
      storage: "70 GB SSD"
    }
  },
  price: {
    amount: 59.99,
    currency: "USD"
  },
  rating: 8.9,
  dlc: [
  {
    title: "Phantom Liberty",
    description: "A spy-thriller expansion set in an entirely new district of Night City",
    releaseDate: new Date("2023-09-26")
  }
]
},
{
  title: "Genshin Impact",
  platforms: ["PC", "PlayStation", "Mobile"],
  genre: ["Action RPG", "Open World", "Gacha"],
  developer: "miHoYo",
  publisher: "miHoYo",
  releaseDate: new Date("2020-09-28"),
  description: "An open-world action RPG. In the world of Teyvat, the chosen will be granted the power of elements and guided by the gods to restore peace to the land.",
  coverImage: "https://cdn.mobygames.com/covers/9213927-genshin-impact-playstation-4-front-cover.jpg",
  screenshots: [
    "https://www.rpgfan.com/wp-content/uploads/2020/10/Genshin-Impact-Screenshot-108.jpg",
    "https://i.kinja-img.com/image/upload/c_fit,q_60,w_645/1d295ae72b98f6595fcafc26f031effb.jpg",
    "https://miro.medium.com/v2/resize:fit:1400/1*rIPZKOBzoN1ODAC4OwFcWw.png",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-3SSfxr-fI8LdgViwIyA3e2ssHZftky7ZmA&s",
    "https://64.media.tumblr.com/d427506221ed3b7c9a4d6b747ddc32d9/dff478d3001aa519-32/s1280x1920/fd91e6c4df5c53b042496f47cb56c1721a0d20fb.jpg"
  ],
  systemRequirements: {
    minimum: {
      os: "Windows 7 SP1 64-bit",
      processor: "Intel Core i5 or equivalent",
      memory: "8 GB RAM",
      graphics: "NVIDIA GeForce GT 1030 or better",
      storage: "30 GB"
    },
    recommended: {
      os: "Windows 10 64-bit",
      processor: "Intel Core i7 or equivalent",
      memory: "16 GB RAM",
      graphics: "NVIDIA GeForce GTX 1060 6 GB or better",
      storage: "30 GB SSD"
    }
  },
  price: {
    amount: 0,
    currency: "USD"
  },
  rating: 8.4,
  dlc: [
    { 
      title: "Version Updates", 
      description: "Regular content updates adding new regions, characters, and story chapters",
      releaseStatus: "Ongoing" 
    }
  ]
},
// Checkpoint 
{
  title: "Final Fantasy XVI",
  platforms: ["PlayStation", "PC"],
  genre: ["Action RPG", "Fantasy"],
  developer: "Square Enix",
  publisher: "Square Enix",
  releaseDate: new Date("2023-06-22"),
  description: "The latest entry in the legendary FINAL FANTASY series, an epic dark fantasy world where the fate of the land is decided by the mighty Eikons and the Dominants who wield them.",
  coverImage: "https://upload.wikimedia.org/wikipedia/en/0/00/Final_Fantasy_XVI_cover_art.png",
  screenshots: [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu2thJ56q8FlqMYL--n-drwgYDs42oFC1xEg&s",
    "https://www.newgamenetwork.com/images/uploads/gallery/FinalFantasy16/ffxvi_01.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4GF7TGlYcZFIurbj5MW2PD_N_PHRtFeBcZA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtWNAWm4yBFmw78veddhXZqkv--fMm3Tkb5g&s",
    "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2022/06/final-fantasy-16-landscape-screenshots-ifrit.jpg"
  ],
  systemRequirements: {
    minimum: {
      os: "Windows 10 64-bit",
      processor: "AMD Ryzen 5 1600 / Intel Core i7-8700",
      memory: "16 GB RAM",
      graphics: "AMD Radeon RX 5700 / NVIDIA GeForce GTX 1070",
      storage: "170 GB SSD"
    },
    recommended: {
      os: "Windows 10/11 64-bit",
      processor: "AMD Ryzen 5 3600 / Intel Core i7-10700",
      memory: "16 GB RAM",
      graphics: "AMD Radeon RX 6700 XT / NVIDIA GeForce RTX 3070",
      storage: "170 GB SSD"
    }
  },
  price: {
    amount: 69.99,
    currency: "USD"
  },
  rating: 8.7,
  dlc: [
    {
      title: "Echoes of the Fallen",
      description: "Face the mysterious Fallen and discover the truth behind the legendary Eikon Omega",
      releaseDate: new Date("2023-12-08")
    },
    {
      title: "The Rising Tide",
      description: "Journey to the northern reaches of Valisthea to uncover the truth of the legendary Eikon Leviathan",
      releaseDate: new Date("2024-05-15")
    }
  ]
},
{
  title: "Star Wars Jedi: Survivor",
  platforms: ["PC", "PlayStation", "Xbox"],
  genre: ["Action-Adventure", "Metroidvania"],
  developer: "Respawn Entertainment",
  publisher: "Electronic Arts",
  releaseDate: new Date("2023-04-28"),
  description: "The story of Cal Kestis continues in this galaxy-spanning adventure as he learns what it means to be a Jedi in dark times.",
  coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdEMHLxMUvNAxFKfIfwITArtEtXChYWN7tWA&s",
  screenshots: [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOgWiG4sw19_i9QCk6RS-Cf7itaPqM0CHVYQ&s",
    "https://preview.redd.it/screenshots-i-took-while-playing-jedi-survivor-definitely-v0-h5rhjy2eddhc1.png?width=1080&crop=smart&auto=webp&s=9a7e71758159a3c1c8c0d35de9cfbee1dd3ce2bb",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZmkECcM0eyuK66skCvfw3RzXotOpIJLEALg&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxc7kSRv9_6z3PqaoRzBFZ2cAsBPE-ZXqA1w&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4I04ExS7dw-Avmg0yH_nyxp5EDmVPD8pSIA&s"
  ],
  systemRequirements: {
    minimum: {
      os: "Windows 10 64-bit",
      processor: "Intel Core i7-7700 / AMD Ryzen 5 1400",
      memory: "8 GB RAM",
      graphics: "NVIDIA GeForce GTX 1070 / AMD Radeon RX 580",
      storage: "155 GB"
    },
    recommended: {
      os: "Windows 10 64-bit",
      processor: "Intel Core i5-11600K / AMD Ryzen 5 5600X",
      memory: "16 GB RAM",
      graphics: "NVIDIA GeForce RTX 2070 / AMD RX 6700 XT",
      storage: "155 GB SSD"
    }
  },
  price: {
    amount: 69.99,
    currency: "USD"
  },
  rating: 8.5,
  dlc: [
    {
      title: "Cosmetic DLC Pack",
      description: "Additional cosmetic items for Cal Kestis and BD-1",
      releaseDate: new Date("2023-07-01")
    }
  ]
},
{
  title: "Starfield",
  platforms: ["PC", "Xbox"],
  genre: ["RPG", "Open World", "Sci-Fi"],
  developer: "Bethesda Game Studios",
  publisher: "Bethesda Softworks",
  releaseDate: new Date("2023-09-06"),
  description: "The first new universe in over 25 years from the acclaimed developers of Skyrim and Fallout. In this next-generation role-playing game, create any character you want and explore with unparalleled freedom.",
  coverImage: "https://i.redd.it/4r2l5k1zrnpb1.jpg",
  screenshots: [
 "https://www.gematsu.com/wp-content/uploads/2022/06/Starfield_2022_06-12-22_001.jpg",
    "https://www.gematsu.com/wp-content/uploads/2022/06/Starfield_2022_06-12-22_002.jpg",
    "https://www.gematsu.com/wp-content/uploads/2022/06/Starfield_2022_06-12-22_003.jpg",
    "https://www.gematsu.com/wp-content/uploads/2022/06/Starfield_2022_06-12-22_004.jpg",
    "https://www.gematsu.com/wp-content/uploads/2022/06/Starfield_2022_06-12-22_005.jpg",
    "https://www.gematsu.com/wp-content/uploads/2022/06/Starfield_2022_06-12-22_006.jpg",
    "https://www.gematsu.com/wp-content/uploads/2022/06/Starfield_2022_06-12-22_007.jpg",
    "https://www.gematsu.com/wp-content/uploads/2022/06/Starfield_2022_06-12-22_008.jpg",
    "https://www.gematsu.com/wp-content/uploads/2022/06/Starfield_2022_06-12-22_009.jpg",
    "https://www.gematsu.com/wp-content/uploads/2022/06/Starfield_2022_06-12-22_010.jpg"
  ],
  systemRequirements: {
    minimum: {
      os: "Windows 10 version 21H1 (10.0.19043)",
      processor: "AMD Ryzen 5 2600X / Intel Core i7-6800K",
      memory: "16 GB RAM",
      graphics: "AMD Radeon RX 5700 / NVIDIA GeForce 1070 Ti",
      storage: "125 GB SSD"
    },
    recommended: {
      os: "Windows 10/11 with updates",
      processor: "AMD Ryzen 5 3600X / Intel i5-10600K",
      memory: "16 GB RAM",
      graphics: "AMD Radeon RX 6800 XT / NVIDIA GeForce RTX 2080",
      storage: "125 GB SSD"
    }
  },
  price: {
    amount: 69.99,
    currency: "USD"
  },
  rating: 8.3,
  dlc: [
    {
      title: "Shattered Space",
      description: "New storyline, locations, and quests within the enigmatic House Va'ruun",
      releaseStatus: "TBA 2024"
    }
  ]
},
{
  title: "Assassin's Creed Valhalla",
  platforms: ["PC", "PlayStation", "Xbox"],
  genre: ["Action RPG", "Open World", "Historical"],
  developer: "Ubisoft Montreal",
  publisher: "Ubisoft",
  releaseDate: new Date("2020-11-10"),
  description: "Become Eivor, a legendary Viking warrior raised on tales of battle and glory. Explore England's Dark Ages as you raid your enemies, grow your settlement, and build your political power.",
  coverImage: "https://i.pinimg.com/736x/b5/96/d8/b596d8a6487ad05f323b10494457eef5.jpg",
  screenshots: [
    "https://www.rpgfan.com/wp-content/uploads/2020/07/Assassins-Creed-Valhalla-Screenshot-011.jpg",
    "https://w0.peakpx.com/wallpaper/770/916/HD-wallpaper-assassin-s-creed-valhalla-screenshot.jpg",
    "https://w0.peakpx.com/wallpaper/952/404/HD-wallpaper-assassin-s-creed-valhalla-screenshot.jpg",
    "https://w0.peakpx.com/wallpaper/138/800/HD-wallpaper-assassins-creed-valhalla-2020-game-screenshot.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPIuLbwT2ccdPYYD4wY19CqLtZVOD7rFbw3g&s"
  ],
  systemRequirements: {
    minimum: {
      os: "Windows 10 64-bit",
      processor: "AMD Ryzen 3 1200 / Intel i5-4460",
      memory: "8 GB RAM",
      graphics: "AMD R9 380 / NVIDIA GeForce GTX 960",
      storage: "160 GB"
    },
    recommended: {
      os: "Windows 10 64-bit",
      processor: "AMD Ryzen 5 1600 / Intel i7-4790",
      memory: "8 GB RAM",
      graphics: "AMD RX 570 / NVIDIA GeForce GTX 1060",
      storage: "160 GB SSD"
    }
  },
  price: {
    amount: 59.99,
    currency: "USD"
  },
  rating: 8.2,
  dlc: [
    {
      title: "Wrath of the Druids",
      description: "Journey to Ireland and unravel the mysteries of an ancient druidic cult",
      releaseDate: new Date("2021-05-13")
    },
    {
      title: "The Siege of Paris",
      description: "Infiltrate the fortified city of Paris and the Seine River Valley",
      releaseDate: new Date("2021-08-12")
    },
    {
      title: "Dawn of Ragnarök",
      description: "Embrace your destiny as Odin, the Norse god of Battle and Wisdom",
      releaseDate: new Date("2022-03-10")
    }
  ]
}
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Clear existing data
    await Game.deleteMany({});
    console.log('Deleted existing games');
    
    // Insert sample games
    const inserted = await Game.insertMany(sampleGames);
    console.log(`Inserted ${inserted.length} games`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
}

seedDatabase();