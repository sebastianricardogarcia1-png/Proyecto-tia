/**
 * Catálogo inicial de productos para DULCE chic y sneaks
 * Incluye variantes organizadas por estilo / color.
 */

export const INITIAL_PRODUCTS = [
  {
    id: 'prod-001',
    name: 'Nike Air Force 1',
    price: 240000,
    audience: 'mujer',
    category: 'zapatos',
    description: 'Silueta clásica de Nike con materiales premium, acolchado interior para máximo confort y acabados de edición limitada.',
    imageUrl: '/products/nike-airforce-pink.jpg',
    available: true,
    isNew: true,
    isFeatured: true,
    active: true,
    reference: 'DC-AF1-01',
    variants: [
      {
        id: 'var-af1-1',
        color: 'Rosa Pastel & Cadena Metálica',
        price: 240000,
        imageUrl: '/products/nike-airforce-pink.jpg',
        available: true,
        reference: 'DC-AF1-PINK',
        description: 'Edición especial en tono rosa pastel con acabados premium en cuero sintético, detalles en relieve y cadena decorativa metálica. Suela clásica Air acolchada.'
      },
      {
        id: 'var-af1-2',
        color: 'Cyan Glow Reflective',
        price: 275000,
        imageUrl: '/products/nike-dn-white-cyan.jpg',
        available: true,
        reference: 'DC-AF1-CYAN',
        description: 'Acabado en blanco puro con detalles en celeste vibrante y cámaras de aire traslúcidas de máxima amortiguación.'
      },
      {
        id: 'var-af1-3',
        color: 'Black & White Classic',
        price: 220000,
        imageUrl: '/products/nike-cortez-black-white.jpg',
        available: true,
        reference: 'DC-AF1-BW',
        description: 'Combinación icónica blanco y negro con acabados en cuero mate y detalles contrastantes en cordones.'
      }
    ]
  },
  {
    id: 'prod-002',
    name: 'Adidas Hyperboost',
    price: 280000,
    audience: 'hombre',
    category: 'zapatos',
    description: 'Diseño aerodinámico de vanguardia con amortiguación Hyperboost, tejido transpirable y suela de tracción urbana.',
    imageUrl: '/products/adidas-hyperboost-black.jpg',
    available: true,
    isNew: true,
    isFeatured: true,
    active: true,
    reference: 'DC-HYP-01',
    variants: [
      {
        id: 'var-hyp-1',
        color: 'All Black Stealth',
        price: 280000,
        imageUrl: '/products/adidas-hyperboost-black.jpg',
        available: true,
        reference: 'DC-HYP-BLK',
        description: 'Modelo monocromático negro con tecnología Hyperboost y malla geométrica ultraligera. Look sobrio y elegante.'
      },
      {
        id: 'var-hyp-2',
        color: 'Special Box Edition Black',
        price: 290000,
        imageUrl: '/products/adidas-hyperboost-black-box.jpg',
        available: true,
        reference: 'DC-HYP-BOX',
        description: 'Edición especial con empaque de lujo. Acabados premium en negro mate y soporte reforzado en talón.'
      },
      {
        id: 'var-hyp-3',
        color: 'Lightstrike Pro White & Neon',
        price: 295000,
        imageUrl: '/products/adidas-adizero-evo-sl.jpg',
        available: true,
        reference: 'DC-HYP-EVO',
        description: 'Silueta ultraligera con espuma Lightstrike Pro y las tres franjas en gran formato. Máxima respuesta y estilo sport.'
      }
    ]
  },
  {
    id: 'prod-003',
    name: 'Nike Shox & Trail Tech',
    price: 260000,
    audience: 'mujer',
    category: 'zapatos',
    description: 'Zapatillas de rendimiento urbano y siluetas retro-futuristas con absorción de impacto y materiales de alta durabilidad.',
    imageUrl: '/products/nike-trail-black.jpg',
    available: true,
    isNew: true,
    isFeatured: false,
    active: true,
    reference: 'DC-SHX-01',
    variants: [
      {
        id: 'var-shx-1',
        color: 'Trail Pegasus Black & White',
        price: 260000,
        imageUrl: '/products/nike-trail-black.jpg',
        available: true,
        reference: 'DC-TRL-BW',
        description: 'Sneakers deportivos de alto rendimiento con entresuela de máxima amortiguación y malla transpirable.'
      },
      {
        id: 'var-shx-2',
        color: 'Shox TL Metallic Silver & Pink',
        price: 285000,
        imageUrl: '/products/nike-shox-tl-pink-silver.jpg',
        available: true,
        reference: 'DC-SHX-SLV',
        description: 'Columnas Shox acolchadas en el talón con acabados cromados y malla transpirable en tono rosa pastel.'
      }
    ]
  },
  {
    id: 'prod-004',
    name: 'Adidas Samba Metallic Silver',
    price: 230000,
    audience: 'mujer',
    category: 'zapatos',
    description: 'El clásico indiscutible en su edición metalizada. Tres franjas en contraste, puntera de gamuza y suela de goma color caramelo.',
    imageUrl: '/products/adidas-samba-silver.jpg',
    available: true,
    isNew: true,
    isFeatured: true,
    active: true,
    reference: 'DC-SMB-01',
    variants: [
      {
        id: 'var-smb-1',
        color: 'Metallic Silver & Navy',
        price: 230000,
        imageUrl: '/products/adidas-samba-silver.jpg',
        available: true,
        reference: 'DC-SMB-SLV',
        description: 'Tendencia absoluta en acabado plateado metalizado con las tres franjas en azul marino y suela caramelo.'
      }
    ]
  },
  {
    id: 'prod-005',
    name: 'Nike Air Max Plus TN',
    price: 270000,
    audience: 'hombre',
    category: 'zapatos',
    description: 'Diseño icónico con exoesqueleto ondulado y degradado en verde lima neón. Unidades Tuned Air visibles para amortiguación superior.',
    imageUrl: '/products/nike-airmax-plus-tn-lime.jpg',
    available: true,
    isNew: true,
    isFeatured: false,
    active: true,
    reference: 'DC-TN-01',
    variants: [
      {
        id: 'var-tn-1',
        color: 'Black & Lime Glow',
        price: 270000,
        imageUrl: '/products/nike-airmax-plus-tn-lime.jpg',
        available: true,
        reference: 'DC-TN-LIME',
        description: 'Silueta Tuned Air con líneas reflectivas y acentos en verde lima sobre fondo negro profundo.'
      }
    ]
  },
  {
    id: 'prod-006',
    name: 'Camisa Oversize Streetwear',
    price: 85000,
    audience: 'hombre',
    category: 'camisas',
    description: 'Camisa en lino suave corte oversize con botones de madera y bolsillo frontal. Fresca, moderna y combinable.',
    imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    available: true,
    isNew: false,
    isFeatured: true,
    active: true,
    reference: 'DC-CAM-01',
    variants: [
      {
        id: 'var-cam-1',
        color: 'Beige Lino',
        price: 85000,
        imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
        available: true,
        reference: 'DC-CAM-BEI',
        description: 'Tono arena beige natural, textura ligera de lino premium.'
      },
      {
        id: 'var-cam-2',
        color: 'Blanco Fresh',
        price: 85000,
        imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
        available: true,
        reference: 'DC-CAM-WHT',
        description: 'Blanco puro fresco y versátil para cualquier ocasión casual.'
      },
      {
        id: 'var-cam-3',
        color: 'Negro Urbano',
        price: 89000,
        imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
        available: true,
        reference: 'DC-CAM-BLK',
        description: 'Negro mate elegante con caída holgada.'
      }
    ]
  },
  {
    id: 'prod-007',
    name: 'Gorra Urbana Vintage',
    price: 55000,
    audience: 'hombre',
    category: 'gorras',
    description: 'Gorra snapback de algodón desgastado con bordado en alto relieve y hebilla metálica trasera regulable.',
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
    available: true,
    isNew: true,
    isFeatured: false,
    active: true,
    reference: 'DC-GOR-01',
    variants: [
      {
        id: 'var-gor-1',
        color: 'Brooklyn Black',
        price: 55000,
        imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
        available: true,
        reference: 'DC-GOR-BLK',
        description: 'Negro lavado con bordado blanco de alta definición.'
      },
      {
        id: 'var-gor-2',
        color: 'Camel Sand',
        price: 55000,
        imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80',
        available: true,
        reference: 'DC-GOR-CAM',
        description: 'Tono camel tostado ideal para complementar outfits streetwear.'
      }
    ]
  },
  {
    id: 'prod-008',
    name: 'Jeans Cargo Baggy',
    price: 135000,
    audience: 'hombre',
    category: 'jeans',
    description: 'Jean denim pesado corte holgado con múltiples bolsillos laterales cargo y costuras reforzadas.',
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    available: true,
    isNew: false,
    isFeatured: false,
    active: true,
    reference: 'DC-JEA-01',
    variants: [
      {
        id: 'var-jea-1',
        color: 'Black Denim',
        price: 135000,
        imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
        available: true,
        reference: 'DC-JEA-BLK',
        description: 'Negro con lavado suave y bolsillos cargo profundos.'
      },
      {
        id: 'var-jea-2',
        color: 'Blue Vintage Wash',
        price: 135000,
        imageUrl: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
        available: true,
        reference: 'DC-JEA-BLU',
        description: 'Azul medio con desgaste vintage en rodillas y muslos.'
      }
    ]
  },
  {
    id: 'prod-009',
    name: 'Pantaloneta Street Runner',
    price: 65000,
    audience: 'hombre',
    category: 'pantalonetas',
    description: 'Pantaloneta ligera en microfibra secado rápido, cordón ajustable en cintura y bolsillos con cremallera oculta.',
    imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80',
    available: true,
    isNew: false,
    isFeatured: false,
    active: true,
    reference: 'DC-PAN-01',
    variants: [
      {
        id: 'var-pan-1',
        color: 'Sand Stone',
        price: 65000,
        imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80',
        available: true,
        reference: 'DC-PAN-SND',
        description: 'Color arena neutro, tela elástica y fresca.'
      },
      {
        id: 'var-pan-2',
        color: 'Carbon Black',
        price: 65000,
        imageUrl: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=800&q=80',
        available: false,
        reference: 'DC-PAN-BLK',
        description: 'Negro carbón deportivo con detalles reflectivos.'
      }
    ]
  },
  {
    id: 'prod-010',
    name: 'Top Corset Chic Satinado',
    price: 75000,
    audience: 'mujer',
    category: 'camisas',
    description: 'Top satinado con varillas de ajuste suave, espalda descubierta con tiras cruzadas ajustables. Ideal para salidas de noche.',
    imageUrl: 'https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=800&q=80',
    available: true,
    isNew: true,
    isFeatured: true,
    active: true,
    reference: 'DC-TOP-01',
    variants: [
      {
        id: 'var-top-1',
        color: 'Champagne Satin',
        price: 75000,
        imageUrl: 'https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=800&q=80',
        available: true,
        reference: 'DC-TOP-CHM',
        description: 'Brillo sutil en color champagne con tiras graduables.'
      },
      {
        id: 'var-top-2',
        color: 'Negro Noche',
        price: 78000,
        imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
        available: true,
        reference: 'DC-TOP-BLK',
        description: 'Satín negro de alta densidad con varillas estructuradas.'
      }
    ]
  },
  {
    id: 'prod-011',
    name: 'Bolso Mini Crossbody Acolchado',
    price: 95000,
    audience: 'mujer',
    category: 'bolsos',
    description: 'Bolso de mano y cruzado con textura acolchada geométrica, herrajes dorados y correa combinada de cadena y cuero.',
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
    available: true,
    isNew: false,
    isFeatured: true,
    active: true,
    reference: 'DC-BOL-01',
    variants: [
      {
        id: 'var-bol-1',
        color: 'Cream Acolchado',
        price: 95000,
        imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
        available: true,
        reference: 'DC-BOL-CRM',
        description: 'Tono crema cálido con textura acolchada y broche giratorio dorado.'
      },
      {
        id: 'var-bol-2',
        color: 'Negro Onyx',
        price: 95000,
        imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
        available: true,
        reference: 'DC-BOL-BLK',
        description: 'Negro pulido con cadena dorada desmontable.'
      }
    ]
  },
  {
    id: 'prod-012',
    name: 'Conjunto Lounge Seda Pijama Chic',
    price: 110000,
    audience: 'mujer',
    category: 'pijamas',
    description: 'Pijama de dos piezas en satín suave premium con ribetes en contraste. Fresca, elegante y ultra cómoda para descansar.',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    available: true,
    isNew: true,
    isFeatured: false,
    active: true,
    reference: 'DC-PIJ-01',
    variants: [
      {
        id: 'var-pij-1',
        color: 'Rosa Pastel & Blanco',
        price: 110000,
        imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
        available: true,
        reference: 'DC-PIJ-PNK',
        description: 'Camisa abotonada con ribetes blancos y short elástico a juego.'
      },
      {
        id: 'var-pij-2',
        color: 'Verde Esmeralda',
        price: 115000,
        imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
        available: true,
        reference: 'DC-PIJ-GRN',
        description: 'Tono esmeralda brillante con tacto de seda ultra suave.'
      }
    ]
  },
  {
    id: 'prod-013',
    name: 'Falda Plisada Midi',
    price: 89000,
    audience: 'mujer',
    category: 'faldas',
    description: 'Falda de corte midi con pliegues suaves y pretina elástica con brillo sutil. Combina a la perfección tanto con tacones como con sneakers.',
    imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80',
    available: true,
    isNew: false,
    isFeatured: false,
    active: true,
    reference: 'DC-FAL-01',
    variants: [
      {
        id: 'var-fal-1',
        color: 'Champagne Gold',
        price: 89000,
        imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80',
        available: true,
        reference: 'DC-FAL-GLD',
        description: 'Plisado fino con reflejos dorados y caída fluida.'
      },
      {
        id: 'var-fal-2',
        color: 'Negro Satin',
        price: 89000,
        imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
        available: false,
        reference: 'DC-FAL-BLK',
        description: 'Negro clásico atemporal con pretina elástica reforzada.'
      }
    ]
  }
];
