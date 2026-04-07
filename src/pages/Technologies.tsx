export default function Technologies() {
  return (
    <main className="flex-1 flex flex-col items-center py-8 px-4 md:px-10 lg:px-20">
      <div className="w-full max-w-7xl flex flex-col gap-16">
        {/* Header */}
        <div className="flex flex-col gap-4 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">Технологии строительства</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">Мы используем передовые методы деревянного домостроения, объединяя вековые традиции и современные инновации для создания надежных и теплых домов.</p>
        </div>

        {/* Core Tech */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCu3iD9jnxtlA2BayjCEXlrodAElzcdKVd848YkMnIJb0-WHJhWnMNKBZd-b_7em3v1NbdQqCZSTomwBRWOZkifllgormwskqizIfzRIY2aCQRZfgenullAKzY5DpMhu5-kr55JZ8dSD3kqhhY31YEuwJOhJHsI2XqbL5_Fd6-UTjXhN5eXnPwPgQhsZwyBDiwW8tQFPwPlbekcXxARvIaPvXl2dlkWSNqr9EcnacDAnrf70xk7og6t8-SscduRBlHqUdL2cdXOppc')" }}></div>
          </div>
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Каркасная технология</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Каркасное домостроение — это современный способ возведения загородных домов, при котором основой конструкции служит прочный деревянный каркас. Пространство между элементами каркаса заполняется утеплителем, а конструкция обшивается листовыми материалами с применением защитных мембран. В результате такого подхода дом получается лёгким, энергоэффективным и долговечным.
            </p>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-2">Ключевые преимущества каркасной технологии:</h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
                <span className="text-slate-700 dark:text-slate-300">Сокращённые сроки строительства за счёт сборно-разборной конструкции.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
                <span className="text-slate-700 dark:text-slate-300">Высокая энергоэффективность - многослойный утеплённый контур снижает теплопотери и затраты на отопление.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
                <span className="text-slate-700 dark:text-slate-300">Минимальная усадка — к отделке можно приступать сразу после монтажа каркаса.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
                <span className="text-slate-700 dark:text-slate-300">Независимость от сезона — работы ведутся при любой температуре, без «мокрых» процессов.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
                <span className="text-slate-700 dark:text-slate-300">Лёгкость конструкции дает снижение нагрузки на основание — не требует массивного фундамента.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
                <span className="text-slate-700 dark:text-slate-300">Предсказуемая смета — точный расчёт материалов на этапе проектирования.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
                <span className="text-slate-700 dark:text-slate-300">Экологичность и комфорт — натуральные материалы и правильный парообмен создают здоровый микроклимат.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Additional Services */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 md:p-12 border border-slate-100 dark:border-slate-800">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Инженерные коммуникации</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Мы предлагаем комплексное оснащение дома всеми необходимыми системами для комфортного проживания.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col gap-3 p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="material-symbols-outlined text-4xl text-primary">bolt</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Электрика</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Скрытая безопасная проводка в металлорукавах, сборка щитов, установка розеток и выключателей.</p>
            </div>
            <div className="flex flex-col gap-3 p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="material-symbols-outlined text-4xl text-primary">air</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Вентиляция</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Системы приточно-вытяжной вентиляции с рекуперацией тепла для свежего воздуха круглый год.</p>
            </div>
            <div className="flex flex-col gap-3 p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="material-symbols-outlined text-4xl text-primary">water_drop</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Сантехника</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Разводка труб водоснабжения и канализации, установка санфаянса и душевых кабин.</p>
            </div>
            <div className="flex flex-col gap-3 p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="material-symbols-outlined text-4xl text-primary">mode_heat</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Отопление</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Водяные теплые полы, радиаторное отопление, установка котлов (электрических, газовых, твердотопливных).</p>
            </div>
            <div className="flex flex-col gap-3 p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="material-symbols-outlined text-4xl text-primary">format_paint</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Отделка</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Чистовая внутренняя и наружная отделка экологичными материалами, покраска.</p>
            </div>
            <div className="flex flex-col gap-3 p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="material-symbols-outlined text-4xl text-primary">router</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Умный дом</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Интеграция систем автоматизации, видеонаблюдения и удаленного управления климатом.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
