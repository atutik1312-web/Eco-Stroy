export default function About() {
  return (
    <main className="flex-1 flex flex-col items-center py-8 px-4 md:px-10 lg:px-20">
      <div className="w-full max-w-7xl flex flex-col gap-16">
        
        {/* Hero */}
        <section className="flex flex-col lg:flex-row gap-10 items-center">
          <div className="flex-1 flex flex-col gap-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">О компании Эко-Строй</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Мы — команда увлеченных строителей, объединенных одной целью: создавать экологичные, долговечные и комфортные деревянные дома. С начала 2003 года мы воплощаем мечты наших заказчиков в реальное и уютное жилье.
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Наша миссия — сделать загородную жизнь доступной и комфортной, сохраняя бережное отношение к окружающей среде.
            </p>
          </div>
          <div className="flex-1 w-full">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCrLoomLiFYfie5kZhIt6tiMNMGcYNVDv__d_bKj-3AvhKdsFpirKxNI1_uBprUSzWWC2Hc2d_9d3NZlm284RPMUQs9O4tIeoh-4iI51ZCG4mcOSQEPA_XtMVNgJrCChI1kKDIuaIIwqpnnTBErFjrtk5A8hDexSJFYPwXu0R4TVnhGTX_FCLPpyYy7fgcuOOEvD4_a8aPekg0skoarbe3YxbRY0eMJd73CkYLxNNlnBVSL6kLBwS5vv0UKbdkJDvCy393FVvROWHQ')" }}></div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl text-center border border-slate-100 dark:border-slate-800 shadow-sm">
            <span className="text-4xl md:text-5xl font-black text-primary block mb-2">25+</span>
            <span className="text-slate-600 dark:text-slate-400 font-medium">Лет на рынке</span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl text-center border border-slate-100 dark:border-slate-800 shadow-sm">
            <span className="text-4xl md:text-5xl font-black text-primary block mb-2">100+</span>
            <span className="text-slate-600 dark:text-slate-400 font-medium">Сданных объектов</span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl text-center border border-slate-100 dark:border-slate-800 shadow-sm">
            <span className="text-4xl md:text-5xl font-black text-primary block mb-2">15</span>
            <span className="text-slate-600 dark:text-slate-400 font-medium">Специалистов</span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl text-center border border-slate-100 dark:border-slate-800 shadow-sm">
            <span className="text-4xl md:text-5xl font-black text-primary block mb-2">30</span>
            <span className="text-slate-600 dark:text-slate-400 font-medium">Лет гарантии</span>
          </div>
        </section>

        {/* Team */}
        <section className="flex flex-col gap-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Наша команда</h2>
            <p className="text-slate-600 dark:text-slate-400">Архитекторы, инженеры и мастера, которые вкладывают душу в каждый проект.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Александр Иванов', role: 'Главный архитектор', img: 'https://i.postimg.cc/Nfy1yYbb/architector.png' },
              { name: 'Елена Смирнова', role: 'Руководитель проектов', img: 'https://i.postimg.cc/RV3c39GT/Project_manager.jpg' },
              { name: 'Михаил Волков', role: 'Главный инженер', img: 'https://i.postimg.cc/gkwvwd4D/main_enginer1.jpg' },
              { name: 'Дмитрий Соколов', role: 'Прораб', img: 'https://i.postimg.cc/PrLmLhKQ/prorab.jpg' },
            ].map((member, i) => (
              <div key={i} className="flex flex-col gap-4 group">
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover transition-all duration-500" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">{member.name}</h4>
                  <p className="text-primary font-medium text-sm">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
