import { useState, useRef } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────
type Screen = 'home' | 'explore' | 'submit' | 'saved' | 'profile' | 'article' | 'search' | 'admin' | 'submitSuccess'
type Verdict = 'false' | 'true' | 'partial' | 'pending'
type NavTab = 'home' | 'explore' | 'submit' | 'saved' | 'profile'

interface Article {
  id: number
  headline: string
  description: string
  verdict: Verdict
  topic: string
  date: string
  imageUrl: string
  interactions?: number
  claim?: string
  truth?: string
  summary?: string
}

// ─── Sample Data ─────────────────────────────────────────────────────────────
const ARTICLES: Article[] = [
  {
    id: 1,
    headline: 'هل شرب الماء البارد يحرق دهون البطن بشكل مباشر؟',
    description: 'انتشر هذا الادعاء عبر وسائل التواصل الاجتماعي، لكن الأدلة العلمية المتاحة لا تدعم أن شرب الماء البارد يؤدي إلى حرق الدهون بشكل ملحوظ.',
    verdict: 'false',
    topic: 'التغذية',
    date: '24 سبتمبر 2026',
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=300&fit=crop&auto=format',
    interactions: 4820,
    claim: 'شرب الماء البارد يؤدي إلى حرق كمية كبيرة من الدهون وخاصةً دهون البطن.',
    truth: 'لا يوجد دليل علمي موثوق يثبت أن شرب الماء البارد يحرق الدهون بشكل ملحوظ. الجسم يستهلك طاقة ضئيلة جداً لتسخين الماء البارد إلى درجة حرارة الجسم، وهي كمية لا تُذكر مقارنةً بالسعرات الحرارية اليومية.',
    summary: 'الادعاء مضلل. شرب الماء يدعم الصحة العامة لكنه لا يحرق الدهون بشكل مباشر.',
  },
  {
    id: 2,
    headline: 'النوم الكافي يرتبط ارتباطاً وثيقاً بتحسين الصحة العامة',
    description: 'تؤكد الدراسات العلمية أن النوم بين 7 و9 ساعات يومياً للبالغين يرتبط بتحسين وظائف القلب والجهاز المناعي والصحة النفسية.',
    verdict: 'true',
    topic: 'الصحة العامة',
    date: '23 سبتمبر 2026',
    imageUrl: 'https://images.unsplash.com/photo-1520206183501-b80df61043c2?w=600&h=300&fit=crop&auto=format',
    interactions: 2310,
    claim: 'النوم الكافي يساهم في تحسين الصحة العامة.',
    truth: 'صحيح. أثبتت آلاف الدراسات العلمية أن الحصول على قسط كافٍ من النوم يُحسّن وظائف الدماغ والمناعة والقلب ويقلل من مخاطر الأمراض المزمنة.',
    summary: 'الادعاء صحيح وموثق علمياً. النوم الكافي ركيزة أساسية للصحة.',
  },
  {
    id: 3,
    headline: 'جميع المكملات الغذائية آمنة لأنها طبيعية — ادعاء مضلل',
    description: 'كون المكمل طبيعياً لا يعني بالضرورة أنه آمن. بعض المكملات قد تتفاعل مع الأدوية أو تُلحق الضرر بالكبد عند تناولها بجرعات عالية.',
    verdict: 'false',
    topic: 'المكملات الغذائية',
    date: '22 سبتمبر 2026',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=300&fit=crop&auto=format',
    interactions: 5640,
    claim: 'المكملات الغذائية الطبيعية آمنة تماماً ويمكن تناولها دون استشارة طبية.',
    truth: 'هذا الادعاء خاطئ ويمكن أن يكون خطيراً. "الطبيعي" لا يعني "آمن دائماً". بعض الأعشاب والمكملات قد تتفاعل مع الأدوية أو تسبب سمية للكبد.',
    summary: 'المكملات الطبيعية ليست دائماً آمنة. استشر طبيبك قبل أي مكمل.',
  },
  {
    id: 4,
    headline: 'بعض اللقاحات قد تسبب آثاراً جانبية مؤقتة خفيفة',
    description: 'هذا صحيح ومتوقع. الآثار الجانبية الخفيفة كالاحمرار أو الحمى البسيطة تشير إلى استجابة مناعية طبيعية للجسم.',
    verdict: 'true',
    topic: 'اللقاحات',
    date: '21 سبتمبر 2026',
    imageUrl: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=600&h=300&fit=crop&auto=format',
    interactions: 3120,
    claim: 'بعض اللقاحات تسبب آثاراً جانبية مؤقتة.',
    truth: 'صحيح. الآثار الجانبية المؤقتة كالألم في موضع الحقن أو الحمى الخفيفة هي استجابات طبيعية تدل على أن الجهاز المناعي يتفاعل مع اللقاح كما هو مخطط له.',
    summary: 'الآثار المؤقتة الخفيفة للقاحات طبيعية وتدل على فعاليتها.',
  },
  {
    id: 5,
    headline: 'هل يمكن لنوع معين من الطعام أن يعالج جميع حالات السكري؟',
    description: 'لا يوجد طعام واحد قادر على علاج السكري. إدارة المرض تتطلب نهجاً شاملاً يشمل النظام الغذائي والأدوية ومتابعة الطبيب.',
    verdict: 'false',
    topic: 'الأمراض المزمنة',
    date: '20 سبتمبر 2026',
    imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=300&fit=crop&auto=format',
    interactions: 7890,
    claim: 'تناول نوع معين من الطعام يعالج جميع حالات مرض السكري نهائياً.',
    truth: 'خاطئ تماماً. لا يوجد علاج غذائي واحد يشفي مرض السكري. يتطلب تدبير السكري برنامجاً علاجياً متكاملاً يشمل الأدوية والتغذية السليمة والنشاط البدني.',
    summary: 'لا يوجد طعام يعالج السكري وحده. الادعاء مضلل وخطير.',
  },
]

const TRENDING = [
  { id: 6, claim: 'هل الليمون يحرق دهون البطن؟', topic: 'التغذية', interactions: 12400, status: 'pending' as Verdict },
  { id: 7, claim: 'هل يمكن تناول الدواء X مع الدواء Y؟', topic: 'الأدوية', interactions: 8700, status: 'partial' as Verdict },
  { id: 8, claim: 'هل فيتامين C يمنع الإنفلونزا؟', topic: 'اللقاحات', interactions: 6200, status: 'false' as Verdict },
]

const CATEGORIES = ['الكل', 'التغذية', 'الأدوية', 'اللقاحات', 'الأمراض المعدية', 'الصحة النفسية', 'المكملات']

// ─── Verdict Helpers ──────────────────────────────────────────────────────────
function verdictLabel(v: Verdict): string {
  switch (v) {
    case 'false': return 'ادعاء غير صحيح'
    case 'true': return 'ادعاء صحيح'
    case 'partial': return 'صحيح جزئياً'
    case 'pending': return 'قيد التحقق'
  }
}

function verdictColor(v: Verdict): string {
  switch (v) {
    case 'false': return '#A3271E'
    case 'true': return '#1B6B3F'
    case 'partial': return '#96660A'
    case 'pending': return '#5C6B7A'
  }
}

function verdictBg(v: Verdict): string {
  switch (v) {
    case 'false': return '#FDF0EF'
    case 'true': return '#EEF7F2'
    case 'partial': return '#FDF6E7'
    case 'pending': return '#F0F2F4'
  }
}

// ─── VerdictBadge ─────────────────────────────────────────────────────────────
function VerdictBadge({ verdict, size = 'sm' }: { verdict: Verdict; size?: 'sm' | 'lg' }) {
  const color = verdictColor(verdict)
  const bg = verdictBg(verdict)
  const label = verdictLabel(verdict)
  return (
    <span
      style={{ color, backgroundColor: bg, borderColor: color + '33' }}
      className={`inline-flex items-center gap-1.5 border rounded-sm font-body-ar font-medium ${size === 'lg' ? 'text-sm px-3 py-1.5' : 'text-xs px-2 py-0.5'}`}
    >
      <span style={{ backgroundColor: color }} className="w-1.5 h-1.5 rounded-full shrink-0" />
      {label}
    </span>
  )
}

// ─── NabeehLogo ───────────────────────────────────────────────────────────────
function NabeehLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="16" cy="16" rx="14" ry="9" stroke="#5C0F22" strokeWidth="2" fill="none" />
      <circle cx="16" cy="16" r="5" stroke="#5C0F22" strokeWidth="1.5" fill="none" />
      <circle cx="16" cy="16" r="2" fill="#5C0F22" />
      <line x1="16" y1="11" x2="16" y2="9" stroke="#5C0F22" strokeWidth="1.2" />
      <line x1="16" y1="21" x2="16" y2="23" stroke="#5C0F22" strokeWidth="1.2" />
      <line x1="21" y1="16" x2="23" y2="16" stroke="#5C0F22" strokeWidth="1.2" />
      <line x1="11" y1="16" x2="9" y2="16" stroke="#5C0F22" strokeWidth="1.2" />
      <line x1="19.5" y1="12.5" x2="21" y2="11" stroke="#5C0F22" strokeWidth="1" />
      <line x1="12.5" y1="19.5" x2="11" y2="21" stroke="#5C0F22" strokeWidth="1" />
      <line x1="19.5" y1="19.5" x2="21" y2="21" stroke="#5C0F22" strokeWidth="1" />
      <line x1="12.5" y1="12.5" x2="11" y2="11" stroke="#5C0F22" strokeWidth="1" />
    </svg>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = {
  Home: ({ active }: { active?: boolean }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#5C0F22' : '#5C6B7A'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9L12 2l9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9,22 9,12 15,12 15,22" />
    </svg>
  ),
  Explore: ({ active }: { active?: boolean }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#5C0F22' : '#5C6B7A'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Submit: ({ active }: { active?: boolean }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#5C0F22' : '#5C6B7A'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  ),
  Saved: ({ active }: { active?: boolean }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#5C0F22' : 'none'} stroke={active ? '#5C0F22' : '#5C6B7A'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
  ),
  Profile: ({ active }: { active?: boolean }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#5C0F22' : '#5C6B7A'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Bookmark: ({ filled }: { filled?: boolean }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? '#5C0F22' : 'none'} stroke="#5C0F22" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
  ),
  Share: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5C6B7A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  Check: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1B6B3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Search: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5C6B7A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  External: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5C0F22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
  Fire: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#96660A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 01-7 7 7 7 0 01-7-7c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
    </svg>
  ),
  Admin: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5C6B7A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
}

// ─── ArticleCard ──────────────────────────────────────────────────────────────
function ArticleCard({
  article,
  onOpen,
  saved,
  onToggleSave,
}: {
  article: Article
  onOpen: () => void
  saved: boolean
  onToggleSave: () => void
}) {
  return (
    <article
      className="card-hover cursor-pointer border-b"
      style={{ borderColor: 'var(--border)' }}
      onClick={onOpen}
    >
      <div className="p-4 pb-3">
        <div className="flex items-center gap-2 mb-2">
          <VerdictBadge verdict={article.verdict} />
          <span className="text-xs font-body-ar" style={{ color: 'var(--muted)' }}>
            {article.topic}
          </span>
        </div>
        <h3 className="font-serif-ar text-base font-semibold leading-snug mb-2" style={{ color: 'var(--foreground)' }}>
          {article.headline}
        </h3>
        <p className="text-sm leading-relaxed font-body-ar mb-3" style={{ color: 'var(--muted)' }}>
          {article.description}
        </p>
        <div className="rounded-sm overflow-hidden mb-3" style={{ height: 160 }}>
          <img
            src={article.imageUrl}
            alt={article.headline}
            className="w-full h-full object-cover"
            style={{ backgroundColor: '#e8e4dc' }}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-body-ar" style={{ color: 'var(--muted)' }}>{article.date}</span>
            <span className="text-xs font-body-ar" style={{ color: 'var(--muted)' }}>· تم التحقق من مصادر موثوقة</span>
          </div>
          <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
            <button className="p-1" onClick={onToggleSave}>
              <Icon.Bookmark filled={saved} />
            </button>
            <button className="p-1">
              <Icon.Share />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

// ─── Screen: Home ─────────────────────────────────────────────────────────────
function HomeScreen({
  onOpenArticle,
  savedIds,
  onToggleSave,
}: {
  onOpenArticle: (a: Article) => void
  savedIds: Set<number>
  onToggleSave: (id: number) => void
}) {
  const [activeCategory, setActiveCategory] = useState('الكل')
  const featured = ARTICLES[0]
  const feed = ARTICLES.slice(1)

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <header className="shrink-0 px-4 pt-4 pb-3 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
        <div className="flex items-center justify-between mb-0.5">
          <div className="flex items-center gap-2">
            <NabeehLogo size={28} />
            <div>
              <h1 className="font-serif-ar text-lg font-bold leading-none" style={{ color: 'var(--brand)' }}>نبيه</h1>
            </div>
          </div>
          <span className="text-xs font-body-ar" style={{ color: 'var(--muted)' }}>NABEEH</span>
        </div>
        <p className="text-xs font-body-ar mt-1" style={{ color: 'var(--muted)' }}>نتحقق من المعلومات الصحية</p>
      </header>

      {/* Categories */}
      <div className="shrink-0 border-b overflow-x-auto" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
        <div className="flex gap-0 px-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="shrink-0 px-3 py-2.5 text-sm font-body-ar font-medium border-b-2 transition-colors"
              style={{
                color: activeCategory === cat ? 'var(--brand)' : 'var(--muted)',
                borderBottomColor: activeCategory === cat ? 'var(--brand)' : 'transparent',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable feed */}
      <div className="flex-1 overflow-y-auto" style={{ backgroundColor: 'var(--background)' }}>
        {/* Featured */}
        <div
          className="cursor-pointer card-hover border-b"
          style={{ borderColor: 'var(--border)' }}
          onClick={() => onOpenArticle(featured)}
        >
          <div className="relative" style={{ height: 200 }}>
            <img
              src={featured.imageUrl}
              alt={featured.headline}
              className="w-full h-full object-cover"
              style={{ backgroundColor: '#ddd8cc' }}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(31,31,31,0.85) 0%, transparent 50%)' }} />
            <div className="absolute bottom-0 right-0 left-0 p-4">
              <VerdictBadge verdict={featured.verdict} size="lg" />
              <h2 className="font-serif-ar text-lg font-bold mt-2 leading-snug text-white">
                {featured.headline}
              </h2>
              <button
                className="mt-2 px-4 py-1.5 text-xs font-body-ar font-medium rounded-sm"
                style={{ backgroundColor: 'var(--brand)', color: 'white' }}
              >
                اقرأ التحقق
              </button>
            </div>
          </div>
        </div>

        {/* Trending section */}
        <div className="px-4 pt-4 pb-2 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="font-serif-ar text-base font-bold mb-3" style={{ color: 'var(--foreground)' }}>
            الأكثر تداولاً
          </h2>
          <div className="flex flex-col gap-2">
            {TRENDING.map((t, i) => (
              <div key={t.id} className="flex items-start gap-3 py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                <span className="font-serif-ar text-2xl font-bold w-6 text-left shrink-0" style={{ color: 'var(--border)' }}>
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-body-ar font-medium leading-snug mb-1" style={{ color: 'var(--foreground)' }}>{t.claim}</p>
                  <div className="flex items-center gap-2">
                    <Icon.Fire />
                    <span className="text-xs font-body-ar" style={{ color: 'var(--verdict-partial)' }}>متداول الآن</span>
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>·</span>
                    <VerdictBadge verdict={t.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feed */}
        {feed.map(article => (
          <ArticleCard
            key={article.id}
            article={article}
            onOpen={() => onOpenArticle(article)}
            saved={savedIds.has(article.id)}
            onToggleSave={() => onToggleSave(article.id)}
          />
        ))}
        <div className="h-4" />
      </div>
    </div>
  )
}

// ─── Screen: Explore ──────────────────────────────────────────────────────────
function ExploreScreen({ onOpenArticle }: { onOpenArticle: (a: Article) => void }) {
  const topics = ['التغذية', 'الأدوية', 'اللقاحات', 'الأمراض', 'الصحة النفسية', 'اللياقة', 'المكملات الغذائية']

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <header className="shrink-0 px-4 pt-4 pb-3 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
        <h1 className="font-serif-ar text-xl font-bold" style={{ color: 'var(--foreground)' }}>استكشف</h1>
      </header>
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 pt-4">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-sm border mb-5" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
            <Icon.Search />
            <span className="text-sm font-body-ar" style={{ color: 'var(--muted)' }}>ابحث عن معلومة صحية...</span>
          </div>
        </div>

        <Section title="الادعاءات الرائجة">
          {TRENDING.map(t => (
            <div key={t.id} className="flex items-start gap-3 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="flex-1">
                <p className="text-sm font-body-ar font-medium mb-1" style={{ color: 'var(--foreground)' }}>{t.claim}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-body-ar" style={{ color: 'var(--muted)' }}>{t.topic}</span>
                  <span style={{ color: 'var(--muted)' }}>·</span>
                  <span className="text-xs font-body-ar" style={{ color: 'var(--muted)' }}>{t.interactions.toLocaleString('ar')} تفاعل</span>
                </div>
              </div>
              <VerdictBadge verdict={t.status} />
            </div>
          ))}
        </Section>

        <Section title="آخر التحققات">
          {ARTICLES.slice(0, 3).map(a => (
            <div
              key={a.id}
              className="cursor-pointer card-hover py-3 border-b flex items-start gap-3"
              style={{ borderColor: 'var(--border)' }}
              onClick={() => onOpenArticle(a)}
            >
              <div className="flex-1">
                <p className="text-sm font-body-ar font-semibold mb-1 leading-snug" style={{ color: 'var(--foreground)' }}>{a.headline}</p>
                <div className="flex items-center gap-2">
                  <VerdictBadge verdict={a.verdict} />
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>{a.date}</span>
                </div>
              </div>
              <div className="w-16 h-16 rounded-sm overflow-hidden shrink-0" style={{ backgroundColor: '#e8e4dc' }}>
                <img src={a.imageUrl} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          ))}
        </Section>

        <Section title="حسب الموضوع">
          <div className="grid grid-cols-2 gap-2 pb-2">
            {topics.map(t => (
              <button
                key={t}
                className="px-3 py-3 text-sm font-body-ar font-medium border rounded-sm text-right"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground)', backgroundColor: 'var(--surface)' }}
              >
                {t}
              </button>
            ))}
          </div>
        </Section>
        <div className="h-4" />
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-4 mb-2">
      <h2 className="font-serif-ar text-base font-bold pt-4 pb-2 border-b mb-1" style={{ color: 'var(--foreground)', borderColor: 'var(--border)' }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

// ─── Screen: Article Detail ───────────────────────────────────────────────────
function ArticleScreen({
  article,
  onBack,
  saved,
  onToggleSave,
}: {
  article: Article
  onBack: () => void
  saved: boolean
  onToggleSave: () => void
}) {
  const sources = [
    { name: 'منظمة الصحة العالمية', title: 'Health Claim Evidence Review 2025', date: 'يناير 2025' },
    { name: 'وزارة الصحة', title: 'إرشادات التغذية والصحة العامة', date: 'مارس 2025' },
    { name: 'PubMed', title: 'Peer-reviewed meta-analysis on metabolic claims', date: 'فبراير 2025' },
  ]

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Back header */}
      <header className="shrink-0 flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
        <button onClick={onBack} className="p-1">
          <Icon.ChevronLeft />
        </button>
        <span className="text-sm font-body-ar font-medium" style={{ color: 'var(--muted)' }}>تحقق من الادعاء</span>
      </header>

      <div className="flex-1 overflow-y-auto">
        {/* Verdict banner */}
        <div
          className="px-4 py-4 border-b"
          style={{ backgroundColor: verdictBg(article.verdict), borderColor: verdictColor(article.verdict) + '33' }}
        >
          <VerdictBadge verdict={article.verdict} size="lg" />
        </div>

        {/* Hero image */}
        <div style={{ height: 200, backgroundColor: '#e8e4dc' }}>
          <img src={article.imageUrl} alt={article.headline} className="w-full h-full object-cover" />
        </div>

        <div className="px-4 py-4">
          {/* Headline */}
          <h1 className="font-serif-ar text-xl font-bold leading-snug mb-3" style={{ color: 'var(--foreground)' }}>
            {article.headline}
          </h1>
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xs font-body-ar px-2 py-0.5 rounded-sm border" style={{ color: 'var(--muted)', borderColor: 'var(--border)' }}>{article.topic}</span>
            <span className="text-xs font-body-ar" style={{ color: 'var(--muted)' }}>{article.date}</span>
          </div>

          {/* AI indicator */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-sm border mb-5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: 'var(--brand)' }} />
            <p className="text-xs font-body-ar" style={{ color: 'var(--muted)' }}>
              تم التحقق باستخدام الذكاء الاصطناعي ومراجعة المصادر الطبية
            </p>
          </div>

          <Divider />

          {/* Sections */}
          <ArticleSection title="الادعاء">
            <p className="text-sm font-body-ar leading-relaxed p-3 rounded-sm border-r-2" style={{ color: 'var(--foreground)', backgroundColor: 'var(--surface)', borderRightColor: 'var(--muted)' }}>
              "{article.claim}"
            </p>
          </ArticleSection>

          <ArticleSection title="الحقيقة">
            <p className="text-sm font-body-ar leading-relaxed" style={{ color: 'var(--foreground)' }}>
              {article.truth}
            </p>
          </ArticleSection>

          <ArticleSection title="كيف تحققنا؟">
            <p className="text-sm font-body-ar leading-relaxed" style={{ color: 'var(--foreground)' }}>
              قام فريق نبيه بمقارنة الادعاء مع قواعد البيانات الطبية والمراجعات العلمية المحكّمة، بالاستعانة بتقنيات الذكاء الاصطناعي لاستخلاص الأدلة ذات الصلة ومراجعتها من قِبَل المحررين الطبيين.
            </p>
          </ArticleSection>

          <ArticleSection title="الأدلة والمصادر">
            <div className="flex flex-col gap-2">
              {sources.map((s, i) => (
                <div key={i} className="p-3 rounded-sm border flex items-start justify-between gap-2" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                  <div>
                    <p className="text-sm font-body-ar font-semibold mb-0.5" style={{ color: 'var(--foreground)' }}>{s.name}</p>
                    <p className="text-xs font-body-ar" style={{ color: 'var(--muted)' }}>{s.title}</p>
                    <p className="text-xs font-body-ar mt-1" style={{ color: 'var(--muted)' }}>{s.date}</p>
                  </div>
                  <button className="flex items-center gap-1 shrink-0 text-xs font-body-ar font-medium" style={{ color: 'var(--brand)' }}>
                    عرض المصدر <Icon.External />
                  </button>
                </div>
              ))}
            </div>
          </ArticleSection>

          <ArticleSection title="الخلاصة">
            <p className="text-sm font-body-ar leading-relaxed font-medium" style={{ color: 'var(--foreground)' }}>
              {article.summary}
            </p>
          </ArticleSection>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t mt-4" style={{ borderColor: 'var(--border)' }}>
            <button
              className="flex items-center gap-2 text-sm font-body-ar font-medium"
              style={{ color: 'var(--brand)' }}
              onClick={onToggleSave}
            >
              <Icon.Bookmark filled={saved} />
              {saved ? 'محفوظ' : 'حفظ'}
            </button>
            <button className="flex items-center gap-2 text-sm font-body-ar" style={{ color: 'var(--muted)' }}>
              <Icon.Share />
              مشاركة
            </button>
          </div>
        </div>
        <div className="h-4" />
      </div>
    </div>
  )
}

function ArticleSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h2 className="font-serif-ar text-base font-bold mb-2 pb-1 border-b" style={{ color: 'var(--foreground)', borderColor: 'var(--border)' }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

function Divider() {
  return <div className="h-px mb-5" style={{ backgroundColor: 'var(--border)' }} />
}

// ─── Screen: Submit Claim ─────────────────────────────────────────────────────
function SubmitScreen({ onSuccess }: { onSuccess: () => void }) {
  const [claim, setClaim] = useState('')
  const [source, setSource] = useState('')
  const [link, setLink] = useState('')
  const [platform, setPlatform] = useState('')

  const platforms = ['TikTok', 'X', 'Instagram', 'WhatsApp', 'Facebook', 'YouTube', 'موقع إلكتروني', 'أخرى']

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (claim.trim()) onSuccess()
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <header className="shrink-0 px-4 pt-4 pb-3 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
        <h1 className="font-serif-ar text-xl font-bold" style={{ color: 'var(--foreground)' }}>أرسل ادعاء للتحقق</h1>
        <p className="text-xs font-body-ar mt-1 leading-relaxed" style={{ color: 'var(--muted)' }}>
          شاهدت معلومة صحية وتريد معرفة مدى صحتها؟ أرسلها إلى فريق نبيه.
        </p>
      </header>
      <div className="flex-1 overflow-y-auto px-4 py-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-body-ar font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>
              نص الادعاء <span style={{ color: 'var(--verdict-false)' }}>*</span>
            </label>
            <textarea
              value={claim}
              onChange={e => setClaim(e.target.value)}
              placeholder="اكتب الادعاء الصحي كما رأيته..."
              rows={4}
              className="w-full px-3 py-2.5 text-sm font-body-ar border rounded-sm resize-none outline-none focus:ring-1"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)', color: 'var(--foreground)' }}
            />
          </div>

          <div>
            <label className="block text-sm font-body-ar font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
              أين رأيت هذا الادعاء؟
            </label>
            <div className="grid grid-cols-2 gap-2">
              {platforms.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatform(p)}
                  className="px-3 py-2 text-sm font-body-ar border rounded-sm text-right transition-colors"
                  style={{
                    borderColor: platform === p ? 'var(--brand)' : 'var(--border)',
                    backgroundColor: platform === p ? '#5C0F2210' : 'var(--surface)',
                    color: platform === p ? 'var(--brand)' : 'var(--foreground)',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-body-ar font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>
              رابط المصدر <span className="font-normal text-xs" style={{ color: 'var(--muted)' }}>(اختياري)</span>
            </label>
            <input
              type="url"
              value={link}
              onChange={e => setLink(e.target.value)}
              placeholder="https://..."
              dir="ltr"
              className="w-full px-3 py-2.5 text-sm font-body-ar border rounded-sm outline-none"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)', color: 'var(--foreground)' }}
            />
          </div>

          <div>
            <label className="block text-sm font-body-ar font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>
              إرفاق صورة <span className="font-normal text-xs" style={{ color: 'var(--muted)' }}>(اختياري)</span>
            </label>
            <div
              className="border-2 border-dashed rounded-sm px-4 py-5 text-center"
              style={{ borderColor: 'var(--border)' }}
            >
              <p className="text-sm font-body-ar" style={{ color: 'var(--muted)' }}>اضغط لرفع صورة</p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 text-base font-body-ar font-semibold rounded-sm mt-2"
            style={{ backgroundColor: 'var(--brand)', color: 'white' }}
          >
            إرسال الادعاء
          </button>
        </form>
        <div className="h-4" />
      </div>
    </div>
  )
}

// ─── Screen: Submit Success ───────────────────────────────────────────────────
function SubmitSuccessScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col h-full items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-full border-2 flex items-center justify-center mb-5" style={{ borderColor: 'var(--verdict-true)', backgroundColor: 'var(--verdict-true-bg)' }}>
        <Icon.Check />
      </div>
      <h2 className="font-serif-ar text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>تم استلام الادعاء</h2>
      <p className="text-sm font-body-ar leading-relaxed mb-2" style={{ color: 'var(--muted)' }}>
        شكراً لمساهمتك. سيقوم فريق نبيه بمراجعة الادعاء والتحقق منه باستخدام مصادر موثوقة.
      </p>
      <span className="inline-flex items-center gap-1.5 text-xs font-body-ar px-3 py-1 border rounded-sm mt-2 mb-8" style={{ color: 'var(--verdict-partial)', borderColor: 'var(--verdict-partial)', backgroundColor: 'var(--verdict-partial-bg)' }}>
        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: 'var(--verdict-partial)' }} />
        قيد المراجعة
      </span>
      <button
        onClick={onBack}
        className="text-sm font-body-ar font-medium"
        style={{ color: 'var(--brand)' }}
      >
        العودة إلى الرئيسية
      </button>
    </div>
  )
}

// ─── Screen: Search ───────────────────────────────────────────────────────────
function SearchScreen({ onOpenArticle }: { onOpenArticle: (a: Article) => void }) {
  const [query, setQuery] = useState('')
  const results = query.length > 0
    ? ARTICLES.filter(a => a.headline.includes(query) || a.topic.includes(query))
    : []

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <header className="shrink-0 px-4 pt-4 pb-3 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
        <h1 className="font-serif-ar text-xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>البحث</h1>
        <div className="flex items-center gap-2 px-3 py-2.5 border rounded-sm" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
          <Icon.Search />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="ابحث عن ادعاء أو موضوع صحي..."
            className="flex-1 text-sm font-body-ar bg-transparent outline-none text-right"
            style={{ color: 'var(--foreground)' }}
          />
        </div>
      </header>
      <div className="flex-1 overflow-y-auto px-4">
        {query.length === 0 && (
          <div className="pt-8 text-center">
            <p className="text-sm font-body-ar" style={{ color: 'var(--muted)' }}>ابحث عن أي ادعاء صحي للتحقق منه</p>
            <div className="mt-5 flex flex-wrap gap-2 justify-center">
              {['فيتامين D', 'اللقاحات', 'السكري', 'الدهون'].map(tag => (
                <button key={tag} onClick={() => setQuery(tag)} className="px-3 py-1.5 text-xs font-body-ar border rounded-sm" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
        {query.length > 0 && results.length === 0 && (
          <div className="pt-8 text-center">
            <p className="text-sm font-body-ar" style={{ color: 'var(--muted)' }}>لا توجد نتائج لـ "{query}"</p>
          </div>
        )}
        {results.map(a => (
          <div
            key={a.id}
            className="cursor-pointer card-hover py-3 border-b"
            style={{ borderColor: 'var(--border)' }}
            onClick={() => onOpenArticle(a)}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-sm font-body-ar font-semibold mb-1 leading-snug" style={{ color: 'var(--foreground)' }}>{a.headline}</p>
                <div className="flex items-center gap-2">
                  <VerdictBadge verdict={a.verdict} />
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>{a.topic}</span>
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>{a.date}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Screen: Saved ────────────────────────────────────────────────────────────
function SavedScreen({ savedIds, onOpenArticle, onToggleSave }: { savedIds: Set<number>; onOpenArticle: (a: Article) => void; onToggleSave: (id: number) => void }) {
  const savedArticles = ARTICLES.filter(a => savedIds.has(a.id))

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <header className="shrink-0 px-4 pt-4 pb-3 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
        <h1 className="font-serif-ar text-xl font-bold" style={{ color: 'var(--foreground)' }}>المحفوظات</h1>
      </header>
      <div className="flex-1 overflow-y-auto">
        {savedArticles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <Icon.Saved active={false} />
            <h3 className="font-serif-ar text-base font-semibold mt-3 mb-1" style={{ color: 'var(--foreground)' }}>لا توجد مقالات محفوظة بعد</h3>
            <p className="text-sm font-body-ar" style={{ color: 'var(--muted)' }}>احفظ أي تحقق للعودة إليه لاحقاً.</p>
          </div>
        ) : (
          savedArticles.map(article => (
            <ArticleCard
              key={article.id}
              article={article}
              onOpen={() => onOpenArticle(article)}
              saved={true}
              onToggleSave={() => onToggleSave(article.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}

// ─── Screen: Profile ──────────────────────────────────────────────────────────
function ProfileScreen({ onAdmin }: { onAdmin: () => void }) {
  const sections = [
    { title: 'منهجية التحقق', desc: 'نعتمد على منهجية علمية دقيقة تجمع بين الذكاء الاصطناعي ومراجعة المصادر الطبية والعلمية الموثوقة.' },
    { title: 'مصادرنا', desc: 'وزارة الصحة، منظمة الصحة العالمية، PubMed، المجلات الطبية المحكّمة، الجمعيات الطبية المعتمدة.' },
    { title: 'عن المشروع', desc: 'نبيه مشروع صحفي رقمي يهدف إلى مكافحة المعلومات الصحية المضللة في العالم العربي.' },
    { title: 'تواصل معنا', desc: 'nabeeh@health-verify.com' },
  ]

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <header className="shrink-0 px-4 pt-4 pb-3 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
        <h1 className="font-serif-ar text-xl font-bold" style={{ color: 'var(--foreground)' }}>عن نبيه</h1>
      </header>
      <div className="flex-1 overflow-y-auto">
        {/* Brand header */}
        <div className="px-4 py-6 border-b flex items-center gap-4" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
          <NabeehLogo size={48} />
          <div>
            <h2 className="font-serif-ar text-xl font-bold" style={{ color: 'var(--brand)' }}>نبيه</h2>
            <p className="text-xs font-body-ar" style={{ color: 'var(--muted)' }}>NABEEH · منصة التحقق الصحي</p>
          </div>
        </div>

        <div className="px-4 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <p className="text-sm font-body-ar leading-relaxed" style={{ color: 'var(--foreground)' }}>
            نبيه منصة للتحقق من المعلومات والادعاءات الصحية المتداولة، باستخدام الذكاء الاصطناعي والمصادر الطبية والعلمية الموثوقة.
          </p>
        </div>

        {sections.map(s => (
          <div key={s.title} className="px-4 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-serif-ar text-sm font-bold mb-1.5" style={{ color: 'var(--foreground)' }}>{s.title}</h3>
            <p className="text-sm font-body-ar leading-relaxed" style={{ color: 'var(--muted)' }}>{s.desc}</p>
          </div>
        ))}

        {/* Language */}
        <div className="px-4 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <span className="text-sm font-body-ar font-medium" style={{ color: 'var(--foreground)' }}>اللغة</span>
          <div className="flex items-center gap-2 text-sm font-body-ar">
            <span style={{ color: 'var(--brand)', fontWeight: 600 }}>العربية</span>
            <span style={{ color: 'var(--border)' }}>|</span>
            <span style={{ color: 'var(--muted)' }}>English</span>
          </div>
        </div>

        {/* Admin link */}
        <div className="px-4 py-4">
          <button
            onClick={onAdmin}
            className="flex items-center gap-2 text-sm font-body-ar"
            style={{ color: 'var(--muted)' }}
          >
            <Icon.Admin />
            لوحة تحكم نبيه (للفريق التحريري)
          </button>
        </div>
        <div className="h-4" />
      </div>
    </div>
  )
}

// ─── Screen: Admin Dashboard ──────────────────────────────────────────────────
type AdminClaim = { id: number; text: string; platform: string; date: string; status: 'new' | 'verifying' | 'pending' | 'published'; aiResult?: AdminAIResult }
type AdminAIResult = { verdict: Verdict; confidence: number; summary: string; sources: string[] }

const ADMIN_CLAIMS: AdminClaim[] = [
  { id: 1, text: 'شرب ماء الليمون يُعالج مرض السرطان.', platform: 'TikTok', date: '24 سبتمبر 2026', status: 'new' },
  { id: 2, text: 'الكركم يُغني عن الأدوية في علاج التهاب المفاصل.', platform: 'WhatsApp', date: '23 سبتمبر 2026', status: 'verifying' },
  { id: 3, text: 'النوم أقل من 6 ساعات يُضاعف خطر الإصابة بالسكري.', platform: 'X', date: '22 سبتمبر 2026', status: 'pending' },
  { id: 4, text: 'فيتامين D يمنع الإصابة بكوفيد-19 بشكل كامل.', platform: 'Facebook', date: '21 سبتمبر 2026', status: 'published' },
]

const STATUS_LABELS: Record<string, string> = {
  new: 'جديد',
  verifying: 'قيد التحقق',
  pending: 'بانتظار المراجعة',
  published: 'منشور',
}
const STATUS_COLORS: Record<string, string> = {
  new: '#5C6B7A',
  verifying: '#96660A',
  pending: '#5C0F22',
  published: '#1B6B3F',
}

function AdminScreen({ onBack }: { onBack: () => void }) {
  const [claims, setClaims] = useState<AdminClaim[]>(ADMIN_CLAIMS)
  const [selectedClaim, setSelectedClaim] = useState<AdminClaim | null>(null)
  const [activeTab, setActiveTab] = useState<'new' | 'verifying' | 'pending' | 'published'>('new')
  const [showWorkflow, setShowWorkflow] = useState(false)

  const workflowSteps = [
    'الادعاء', 'استخراج الادعاء', 'البحث عن الأدلة', 'المصادر الطبية الموثوقة',
    'تحليل الأدلة', 'نتيجة التحقق', 'مراجعة فريق نبيه', 'النشر'
  ]

  const runAI = (claim: AdminClaim) => {
    const result: AdminAIResult = {
      verdict: 'false',
      confidence: 87,
      summary: 'بعد مراجعة الأدلة العلمية المتاحة، لم يُعثر على دليل موثوق يدعم هذا الادعاء. تُشير الدراسات إلى عكس ذلك.',
      sources: ['منظمة الصحة العالمية', 'PubMed - 3 دراسات محكّمة', 'وزارة الصحة'],
    }
    setClaims(prev => prev.map(c => c.id === claim.id ? { ...c, status: 'verifying', aiResult: result } : c))
    setSelectedClaim({ ...claim, status: 'verifying', aiResult: result })
  }

  const publish = (claim: AdminClaim) => {
    setClaims(prev => prev.map(c => c.id === claim.id ? { ...c, status: 'published' } : c))
    setSelectedClaim(null)
  }

  const filteredClaims = claims.filter(c => c.status === activeTab)

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ direction: 'rtl' }}>
      <header className="shrink-0 flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
        <button onClick={onBack} className="p-1">
          <Icon.ChevronLeft />
        </button>
        <div className="flex items-center gap-2">
          <NabeehLogo size={22} />
          <h1 className="font-serif-ar text-base font-bold" style={{ color: 'var(--brand)' }}>لوحة تحكم نبيه</h1>
        </div>
        <button
          onClick={() => setShowWorkflow(!showWorkflow)}
          className="mr-auto text-xs font-body-ar px-2 py-1 border rounded-sm"
          style={{ color: 'var(--muted)', borderColor: 'var(--border)' }}
        >
          سير العمل
        </button>
      </header>

      {showWorkflow && (
        <div className="shrink-0 px-4 py-4 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
          <h2 className="font-serif-ar text-sm font-bold mb-3" style={{ color: 'var(--foreground)' }}>سير عملية التحقق بالذكاء الاصطناعي</h2>
          <div className="flex flex-col gap-1">
            {workflowSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full border flex items-center justify-center text-xs font-body-ar shrink-0"
                  style={{ borderColor: 'var(--brand)', color: 'var(--brand)' }}>{i + 1}</div>
                <span className="text-sm font-body-ar" style={{ color: 'var(--foreground)' }}>{step}</span>
                {i < workflowSteps.length - 1 && (
                  <div className="h-3 w-px mr-2" style={{ backgroundColor: 'var(--border)', position: 'relative', right: '-10px', top: '100%' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="shrink-0 flex border-b overflow-x-auto" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
        {(['new', 'verifying', 'pending', 'published'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setSelectedClaim(null) }}
            className="shrink-0 px-3 py-2.5 text-sm font-body-ar border-b-2 transition-colors"
            style={{
              color: activeTab === tab ? 'var(--brand)' : 'var(--muted)',
              borderBottomColor: activeTab === tab ? 'var(--brand)' : 'transparent',
            }}
          >
            {STATUS_LABELS[tab]}
            <span className="mr-1 text-xs rounded-full px-1.5 py-0.5" style={{ backgroundColor: 'var(--border)', color: 'var(--foreground)' }}>
              {claims.filter(c => c.status === tab).length}
            </span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {selectedClaim ? (
          <div className="px-4 py-4">
            <button onClick={() => setSelectedClaim(null)} className="flex items-center gap-1 text-sm font-body-ar mb-4" style={{ color: 'var(--muted)' }}>
              <Icon.ChevronLeft /> عودة
            </button>
            <div className="p-3 border rounded-sm mb-4" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
              <p className="text-sm font-body-ar font-semibold" style={{ color: 'var(--foreground)' }}>{selectedClaim.text}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-body-ar" style={{ color: 'var(--muted)' }}>{selectedClaim.platform}</span>
                <span style={{ color: 'var(--muted)' }}>·</span>
                <span className="text-xs font-body-ar" style={{ color: 'var(--muted)' }}>{selectedClaim.date}</span>
              </div>
            </div>

            {selectedClaim.aiResult ? (
              <div>
                <h3 className="font-serif-ar text-base font-bold mb-3" style={{ color: 'var(--foreground)' }}>نتيجة الذكاء الاصطناعي</h3>
                <div className="p-4 border rounded-sm mb-3" style={{ borderColor: 'var(--border)', backgroundColor: verdictBg(selectedClaim.aiResult.verdict) }}>
                  <div className="flex items-center justify-between mb-2">
                    <VerdictBadge verdict={selectedClaim.aiResult.verdict} size="lg" />
                    <span className="text-sm font-body-ar" style={{ color: 'var(--muted)' }}>
                      ثقة: <strong style={{ color: 'var(--foreground)' }}>{selectedClaim.aiResult.confidence}%</strong>
                    </span>
                  </div>
                  <p className="text-sm font-body-ar leading-relaxed mb-3" style={{ color: 'var(--foreground)' }}>{selectedClaim.aiResult.summary}</p>
                  <div>
                    <p className="text-xs font-body-ar font-semibold mb-1" style={{ color: 'var(--muted)' }}>المصادر المستخدمة:</p>
                    {selectedClaim.aiResult.sources.map((s, i) => (
                      <p key={i} className="text-xs font-body-ar" style={{ color: 'var(--foreground)' }}>· {s}</p>
                    ))}
                  </div>
                </div>

                <h3 className="font-serif-ar text-sm font-bold mb-2" style={{ color: 'var(--foreground)' }}>مراجعة بشرية</h3>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => publish(selectedClaim)}
                    className="w-full py-2.5 text-sm font-body-ar font-semibold rounded-sm"
                    style={{ backgroundColor: 'var(--brand)', color: 'white' }}
                  >
                    اعتماد ونشر
                  </button>
                  <button className="w-full py-2.5 text-sm font-body-ar border rounded-sm" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                    تعديل
                  </button>
                  <button className="w-full py-2.5 text-sm font-body-ar" style={{ color: 'var(--muted)' }}>
                    إعادة التحقق
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => runAI(selectedClaim)}
                className="w-full py-3 text-sm font-body-ar font-semibold border-2 rounded-sm"
                style={{ borderColor: 'var(--brand)', color: 'var(--brand)', backgroundColor: '#5C0F2208' }}
              >
                تحقق بالذكاء الاصطناعي
              </button>
            )}
          </div>
        ) : (
          <div>
            {filteredClaims.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm font-body-ar" style={{ color: 'var(--muted)' }}>لا توجد ادعاءات في هذه الفئة</p>
              </div>
            ) : filteredClaims.map(claim => (
              <div
                key={claim.id}
                className="cursor-pointer card-hover px-4 py-4 border-b"
                style={{ borderColor: 'var(--border)' }}
                onClick={() => setSelectedClaim(claim)}
              >
                <p className="text-sm font-body-ar font-semibold mb-1 leading-snug" style={{ color: 'var(--foreground)' }}>{claim.text}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-body-ar px-1.5 py-0.5 rounded-sm" style={{ color: STATUS_COLORS[claim.status], backgroundColor: STATUS_COLORS[claim.status] + '15' }}>
                    {STATUS_LABELS[claim.status]}
                  </span>
                  <span className="text-xs font-body-ar" style={{ color: 'var(--muted)' }}>{claim.platform}</span>
                  <span className="text-xs font-body-ar" style={{ color: 'var(--muted)' }}>{claim.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Bottom Navigation ────────────────────────────────────────────────────────
function BottomNav({ active, onChange }: { active: NavTab; onChange: (t: NavTab) => void }) {
  const tabs: { id: NavTab; label: string; icon: (active: boolean) => React.ReactNode }[] = [
    { id: 'home', label: 'الرئيسية', icon: a => <Icon.Home active={a} /> },
    { id: 'explore', label: 'استكشف', icon: a => <Icon.Explore active={a} /> },
    { id: 'submit', label: 'إرسال ادعاء', icon: a => <Icon.Submit active={a} /> },
    { id: 'saved', label: 'المحفوظات', icon: a => <Icon.Saved active={a} /> },
    { id: 'profile', label: 'حسابي', icon: a => <Icon.Profile active={a} /> },
  ]

  return (
    <nav className="shrink-0 border-t flex" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className="flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors"
        >
          {tab.icon(active === tab.id)}
          <span
            className="text-xs font-body-ar"
            style={{ color: active === tab.id ? 'var(--brand)' : 'var(--muted)', fontSize: 9 }}
          >
            {tab.label}
          </span>
        </button>
      ))}
    </nav>
  )
}

// ─── Mobile Shell ─────────────────────────────────────────────────────────────
function MobileShell({ children, showNav, activeTab, onTabChange }: {
  children: React.ReactNode
  showNav: boolean
  activeTab: NavTab
  onTabChange: (t: NavTab) => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#E8E4DC' }}>
      <div
        className="flex flex-col overflow-hidden shadow-2xl"
        style={{
          width: '100%',
          maxWidth: 390,
          height: '844px',
          maxHeight: '95vh',
          backgroundColor: 'var(--background)',
          borderRadius: 36,
          border: '1px solid rgba(0,0,0,0.1)',
        }}
      >
        {/* Status bar */}
        <div className="shrink-0 flex items-center justify-between px-6 pt-3 pb-1" style={{ backgroundColor: 'var(--surface)' }}>
          <span className="text-xs font-body-ar" style={{ color: 'var(--foreground)', fontWeight: 600 }}>9:41</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-2 border rounded-sm border-current" style={{ color: 'var(--foreground)' }}>
              <div className="w-3 h-full rounded-sm" style={{ backgroundColor: 'var(--foreground)' }} />
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          {children}
        </div>
        {showNav && <BottomNav active={activeTab} onChange={onTabChange} />}
      </div>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home')
  const [screen, setScreen] = useState<Screen>('home')
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set())

  const openArticle = (a: Article) => {
    setSelectedArticle(a)
    setScreen('article')
  }

  const toggleSave = (id: number) => {
    setSavedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const goToTab = (tab: NavTab) => {
    setActiveTab(tab)
    setScreen(tab)
  }

  const showNav = !['article', 'admin', 'submitSuccess'].includes(screen)

  const renderScreen = () => {
    if (screen === 'article' && selectedArticle) {
      return (
        <ArticleScreen
          article={selectedArticle}
          onBack={() => setScreen(activeTab)}
          saved={savedIds.has(selectedArticle.id)}
          onToggleSave={() => toggleSave(selectedArticle.id)}
        />
      )
    }
    if (screen === 'admin') {
      return <AdminScreen onBack={() => setScreen('profile')} />
    }
    if (screen === 'submitSuccess') {
      return <SubmitSuccessScreen onBack={() => goToTab('home')} />
    }
    switch (activeTab) {
      case 'home':
        return <HomeScreen onOpenArticle={openArticle} savedIds={savedIds} onToggleSave={toggleSave} />
      case 'explore':
        return <ExploreScreen onOpenArticle={openArticle} />
      case 'submit':
        return <SubmitScreen onSuccess={() => setScreen('submitSuccess')} />
      case 'saved':
        return <SavedScreen savedIds={savedIds} onOpenArticle={openArticle} onToggleSave={toggleSave} />
      case 'profile':
        return <ProfileScreen onAdmin={() => setScreen('admin')} />
    }
  }

  return (
    <MobileShell showNav={showNav} activeTab={activeTab} onTabChange={goToTab}>
      {renderScreen()}
    </MobileShell>
  )
}
