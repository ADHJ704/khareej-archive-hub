export interface Category {
  id: string;
  name: string;
  description?: string;
}

export const categories: Category[] = [
  {
    id: 'cs',
    name: 'علوم الحاسب',
    description: 'مشاريع في مجال علوم الحاسب وهندسة البرمجيات'
  },
  {
    id: 'is',
    name: 'نظم المعلومات',
    description: 'مشاريع في مجال نظم المعلومات وتحليل البيانات'
  },
  {
    id: 'ce',
    name: 'هندسة الحاسب',
    description: 'مشاريع في مجال هندسة الحاسب والأجهزة'
  },
  {
    id: 'ai',
    name: 'الذكاء الاصطناعي',
    description: 'مشاريع تتعلق بالذكاء الاصطناعي وتعلم الآلة'
  },
  {
    id: 'security',
    name: 'أمن المعلومات',
    description: 'مشاريع تتعلق بأمن المعلومات والشبكات'
  },
  {
    id: 'networks',
    name: 'شبكات الحاسب',
    description: 'مشاريع في مجال شبكات الحاسب والاتصالات'
  },
  {
    id: 'mobile',
    name: 'تطبيقات الجوال',
    description: 'مشاريع تطوير تطبيقات الهواتف الذكية'
  },
  {
    id: 'web',
    name: 'تطوير الويب',
    description: 'مشاريع تطوير مواقع وتطبيقات الويب'
  },
  {
    id: 'tech_support',
    name: 'دعم فني حاسب آلي',
    description: 'مشاريع في مجال الدعم الفني وصيانة الحاسب'
  },
  {
    id: 'networking_tech',
    name: 'تقنية شبكات',
    description: 'مشاريع في مجال تقنية الشبكات والاتصالات'
  },
  {
    id: 'programming_tech',
    name: 'برمجة تطبيقات',
    description: 'مشاريع في مجال برمجة التطبيقات والأنظمة'
  },
  {
    id: 'iot_tech',
    name: 'إنترنت الأشياء',
    description: 'مشاريع في مجال إنترنت الأشياء والأنظمة المدمجة'
  },
  {
    id: 'tech_management',
    name: 'إدارة تقنية',
    description: 'مشاريع في مجال إدارة التقنية والمشاريع التقنية'
  }
];
