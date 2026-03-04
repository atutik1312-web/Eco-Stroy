import { Project } from '../types/project';

export const POPULAR_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Нордическая ель',
    price: 14500000,
    area: '120 м²',
    floors: '2 Этажа',
    bedrooms: '3 Спальни',
    material: 'Сосна',
    time: '4 Месяца',
    series: 'Сканди Серия',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRgMuAdKZ9bgx8AEYUIP2JzFsWf7SrVYpD5IhZlQr_r531X3ymNzxzyEfiqM0_Qd46ompcWR3BjlcB6Oyl8sZAoJAwUtSxEKIVHQ_cY8jzbYdGOgJ8s3zS9coTT0dq3sm0tQ7Oxo5BSBN92WnLTSdbSRc2rG0VCjozp3qgttBZNo-5EeJX8qo9HO6RRezHT9jbWinrRRNCRco4Pw7o9h9UznfayPBUDm7_20UPxKGeLkKfqLVc6pF2wSzFvXBhLkEXQA49Ui2mDVw',
    badge: 'Хит продаж',
    badgeColor: 'bg-white/90 dark:bg-black/80 text-slate-900 dark:text-white',
    isPopular: true,
    description: 'Просторный и светлый дом "Нордическая ель", идеально подходящий для постоянного проживания семьи. Панорамные окна в гостиной обеспечивают отличное естественное освещение и вид на природу. Продуманная планировка включает просторную кухню-гостиную, три уютные спальни на втором этаже и два санузла.',
    features: [
      'Панорамное остекление',
      'Просторная терраса',
      'Второй свет в гостиной',
      'Энергоэффективное утепление',
      'Крыльцо под навесом'
    ]
  },
  {
    id: '2',
    title: 'Лесной компакт',
    price: 8500000,
    area: '75 м²',
    floors: '1 Этаж',
    bedrooms: '2 Спальни',
    material: 'Кедр',
    time: '2 Месяца',
    series: 'Компактная Серия',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJATtm5bH2OH0qjD7d5dvqZh0FKnhU49lDBT-gNbEGY37iEN-xuu5xONI_6UydB_ZnQ0h7Q-MJGYCKxrM_PU7CjRpBCzylP3Xqw8SwUTTBPIZr1WQMGd2wr7YW-JgkIOJar2gqlRjt8XY2eJPbxToo3-V24fje7Df28XAGMdMqLItBAevkxygjx_2xIGiwUPSreTS4b6Q3KSTPh9hDgxPRKZWsQMBbVpElUvRFZBGmP_DGnYCA8WshIfXoJGtRY6ccUOFis1f-bHw',
    badge: null,
    badgeColor: '',
    isPopular: false,
    description: 'Уютный одноэтажный дом "Лесной компакт", отличный выбор для небольшой семьи или в качестве дачи. Рациональное использование каждого квадратного метра.',
    features: [
      'Эргономичная планировка',
      'Уютная веранда',
      'Энергоэффективное утепление',
      'Отделка натуральным деревом'
    ]
  },
  {
    id: '3',
    title: 'Альпийский гранд',
    price: 21000000,
    area: '200 м²',
    floors: '2 Этажа',
    bedrooms: '4 Спальни',
    material: 'Лиственница',
    time: '6 Месяцев',
    series: 'Премиум Серия',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlVT7YooF-LKaLRdL41WRS08odrcpn8k_P3RQFQbYsklPRjktC1Z47wOTTO1q0qx_mpMo6SlO07O5pArhoM2NH9ok1DnVNZXa0Tv51cYERQh5jBI2l9MhifdGqyGk5A74i4Pm5mHL192Vr7r-olFDOp3eVEYFEvkQgGJiJO8FjrdOySV6Y_mO3C6plJmVZnx4AirE1JvBzYzXXEbKjGu8j0GjDvcMD4hiaWqVDyZI-UyoPNj5BkOsbK9fn29aI0UxiY9QrJKoBAdw',
    badge: null,
    badgeColor: '',
    isPopular: false,
    description: 'Роскошный особняк "Альпийский гранд" для тех, кто ценит простор и комфорт. Включает в себя большую террасу, балкон и сауну.',
    features: [
      'Премиальные материалы',
      'Сауна в доме',
      'Большая терраса и балкон',
      'Панорамные окна',
      'Высокие потолки'
    ]
  },
  {
    id: '4',
    title: 'Семейный уют',
    price: 12200000,
    area: '110 м²',
    floors: '1 Этаж',
    bedrooms: '3 Спальни',
    material: 'Сосна',
    time: '3 Месяца',
    series: 'Серия Эко-Стандарт',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArqAqjc-WaU3YTlYQMDImI9rOzSm3RiBzhPtmF3xkQ92g2KY_Xji9xAQCJ02pyP6VI2E3sbbh9z8jU01WnIEqZpDCbA3X7HR9Z6t9cokl8eAnTX45i4HHxYb149WgmNWEENNOizy40ZXU5Z41eCE8xcuX7_tzW0INCWlA5D1zUYLUfNbbtyFbfMKvOIKsUNiC5sf1JgFKCcwntMk5hU7mL86cJDoQSaOm9n30vxgteq3R41xMXnMml9o1jNZPJ-J_IYG1N3un4y-o',
    badge: null,
    badgeColor: '',
    isPopular: false,
    description: 'Классический одноэтажный дом "Семейный уют" с тремя спальнями. Идеально подходит для семей с детьми благодаря отсутствию лестниц.',
    features: [
      'Безопасная одноэтажная планировка',
      'Просторная кухня-гостиная',
      'Раздельный санузел',
      'Крытая терраса'
    ]
  },
  {
    id: '5',
    title: 'Эко-Модерн',
    price: 18900000,
    area: '160 м²',
    floors: '2 Этажа',
    bedrooms: '4 Спальни',
    material: 'Кедр',
    time: '5 Месяцев',
    series: 'Модерн Серия',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaoBBxNKK0pLDEpFF1hh1KwU9F2V2tsi0aG9vVEUSAjILpp0FcA2fE8WLUm2ZsOS4SmxfU4mhRoTxqQMSfjKspSEbfJcpBMNKAZibFtTdCPrV8SD0hqB91JOvW1yyIaliqtbbpoXdBiBS2z5w-qSY-SQUVZZGXtDtm3aJJZfWoKIs-f4buZ6NC--l7TNCnnbgY_q2rEpmmJT9fwx01ZLfEMZGeX_u8AwQdXVzYYqv26LueW63DYm-gMK4cfSMk-w-ZIgu2w7jqOqk',
    badge: 'Хит продаж',
    badgeColor: 'bg-white/90 dark:bg-black/80 text-slate-900 dark:text-white',
    isPopular: true,
    description: 'Современный дом "Эко-Модерн" с плоской крышей и строгими линиями. Сочетает в себе экологичность дерева и современный архитектурный стиль.',
    features: [
      'Современный дизайн',
      'Плоская эксплуатируемая кровля',
      'Большая площадь остекления',
      'Мастер-спальня с гардеробной'
    ]
  },
  {
    id: '6',
    title: 'Дачный рай',
    price: 6800000,
    area: '60 м²',
    floors: '1 Этаж',
    bedrooms: '2 Спальни',
    material: 'Сосна',
    time: '1.5 Месяца',
    series: 'Компактная Серия',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlpzK6suxEoh1KUlD-yTrIz1bXrJG2Cs6K5IvGhLVEBXg3yCYK1piOAc3JGZJVKBHcexUWpqi4KJUGOmLyj2vNhPbgetDGFiBmkDjZMkXRJsR6L20W2BE80TLymKdbw9JWSOZURszGxJGFWuFHuVjjJOZl5DBMGlCSoQwkquI2z83z0s3i8Gy4dPpTdCPtJc_W8TZXixYJoC4Zpe_VepBFGsEPAOek1igLadrSX0H2n5BjCByVS4VLt80ETziAMEhNF80I5cGGMmw',
    badge: null,
    badgeColor: '',
    isPopular: false,
    description: 'Небольшой, но очень уютный дом "Дачный рай". Прекрасно впишется в любой участок и станет любимым местом для летнего отдыха.',
    features: [
      'Быстрое возведение',
      'Компактные размеры',
      'Оптимально для дачи',
      'Доступная цена'
    ]
  },
  {
    id: '7',
    title: 'Барнхаус Смарт',
    price: 15300000,
    area: '135 м²',
    floors: '2 Этажа',
    bedrooms: '3 Спальни',
    material: 'Лиственница',
    time: '4 Месяца',
    series: 'Модерн Серия',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCu3iD9jnxtlA2BayjCEXlrodAElzcdKVd848YkMnIJb0-WHJhWnMNKBZd-b_7em3v1NbdQqCZSTomwBRWOZkifllgormwskqizIfzRIY2aCQRZfgenullAKzY5DpMhu5-kr55JZ8dSD3kqhhY31YEuwJOhJHsI2XqbL5_Fd6-UTjXhN5eXnPwPgQhsZwyBDiwW8tQFPwPlbekcXxARvIaPvXl2dlkWSNqr9EcnacDAnrf70xk7og6t8-SscduRBlHqUdL2cdXOppc',
    badge: null,
    badgeColor: '',
    isPopular: false,
    description: 'Стильный дом в архитектурном стиле барнхаус. "Барнхаус Смарт" отличается высокими потолками, вторым светом и минималистичной отделкой.',
    features: [
      'Стиль Барнхаус',
      'Второй свет',
      'Минималистичный дизайн',
      'Скрытая водосточная система'
    ]
  }
];

const GENERATED_PROJECTS: Project[] = Array.from({ length: 33 }, (_, i) => {
  const id = i + 8; // Start from 8
  const isPopular = id % 5 === 0;
  const price = 3000000 + (id * 1234567) % 12000000; 
  const seriesList = ['Серия Эко-Стандарт', 'Премиум Серия', 'Компактная Серия', 'Люкс Серия', 'Сканди Серия', 'Модерн Серия'];
  
  return {
    id: id.toString(),
    title: `Эко-${id}`,
    series: seriesList[i % seriesList.length],
    image: `https://picsum.photos/seed/ecostroy${id}/800/600`,
    badge: isPopular ? 'Популярное' : null,
    badgeColor: isPopular ? 'bg-primary text-slate-900' : '',
    area: `${50 + ((id * 15) % 150)} м²`,
    floors: id % 2 === 0 ? '2 Этажа' : '1 Этаж',
    bedrooms: `${2 + (id % 3)} Спальни`,
    material: ['Сосна', 'Кедр', 'Ель', 'Дуб', 'Лиственница'][id % 5],
    time: `${2 + (id % 4)} Месяца`,
    price,
    isPopular,
    description: `Просторный и светлый дом "Эко-${id}", идеально подходящий для постоянного проживания. Панорамные окна обеспечивают отличное естественное освещение и вид на природу. Продуманная планировка включает просторную кухню-гостиную, уютные спальни и санузлы.`,
    features: [
      'Панорамное остекление',
      'Просторная терраса',
      'Второй свет в гостиной',
      'Энергоэффективное утепление',
      'Крыльцо под навесом'
    ]
  };
});

export const MOCK_PROJECTS: Project[] = [...POPULAR_PROJECTS, ...GENERATED_PROJECTS];
