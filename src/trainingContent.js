// Day-by-day curriculum from the supplied training-curriculum-table.jpg.
export const trainingDays = {
  en: [
    "High-voltage safety, system layout, wiring and electric control assemblies.",
    "Battery structure, pack disassembly and testing.",
    "Battery cells, module disassembly and balancing.",
    "Battery fault analysis and cable replacement.",
    "Air-conditioning compressor testing; drive motors and control systems.",
    "Drive motor and control system maintenance.",
    "Power battery systems; compressor inspection and repair practice.",
    "Rest day.",
    "Integrated electric controls; balancing, charge-discharge and leak-testing equipment.",
    "Equipment practice and vehicle fault checks.",
    "Battery troubleshooting, equipment assessment and battery maintenance.",
    "Motor control, drive motor disassembly and testing.",
    "Motor disassembly; inspection and maintenance practice.",
    "Motor position calibration, test equipment and vehicle fault diagnosis.",
    "Final assessment and completion ceremony."
  ],
  zh: [
    "高压安全、系统布局、高低压线束与电控总成认知。",
    "电池结构、电池包拆装与检测。",
    "电芯基础、模组拆装与均衡。",
    "电池故障检测分析与线束更换。",
    "空调压缩机检测设备；驱动电机与控制系统认知。",
    "驱动电机与控制系统维修。",
    "动力电池系统；压缩机检测与维修实操。",
    "休息。",
    "三合一电控；均衡、充放电与气密性检测设备。",
    "设备操作实训与整车故障检查。",
    "动力电池排故、设备使用考核与电池维修。",
    "电机控制、驱动电机拆装与检测。",
    "电机拆装、检测与维修实操。",
    "电机旋变零位标定、检测设备实操与整车排故。",
    "结业考核与结业仪式。"
  ],
  ar: [
    "سلامة الجهد العالي وتوزيع الأنظمة والأسلاك ووحدات التحكم.",
    "بنية البطارية وفك الحزمة واختبارها.",
    "الخلايا وفك الوحدات وموازنتها.",
    "تحليل أعطال البطارية واستبدال الأسلاك.",
    "اختبار ضاغط التكييف والتعرف على المحرك ونظام التحكم.",
    "صيانة محرك الدفع ونظام التحكم.",
    "أنظمة بطاريات الطاقة والتدريب على فحص الضاغط وصيانته.",
    "يوم راحة.",
    "التحكم الكهربائي المتكامل ومعدات الموازنة والشحن والتفريغ واختبار التسرب.",
    "التدريب على المعدات وفحص أعطال السيارة.",
    "تشخيص البطارية وتقييم استخدام المعدات وصيانة البطارية.",
    "التحكم بالمحرك وفكه واختباره.",
    "التدريب على فك المحرك والفحص والصيانة.",
    "معايرة موضع المحرك ومعدات الاختبار وتشخيص السيارة.",
    "التقييم النهائي وحفل إتمام التدريب."
  ],
  ru: [
    "Высоковольтная безопасность, компоновка систем, проводка и блоки управления.",
    "Устройство батареи, разборка и проверка блока.",
    "Ячейки, разборка и балансировка модулей.",
    "Диагностика батареи и замена проводки.",
    "Проверка компрессора; тяговый двигатель и управление.",
    "Ремонт тягового двигателя и системы управления.",
    "Системы тяговых батарей; проверка и ремонт компрессора.",
    "Выходной день.",
    "Интегрированные блоки управления; балансировка, заряд-разряд и проверка герметичности.",
    "Практика с оборудованием и диагностика автомобиля.",
    "Диагностика батареи, проверка навыков и ремонт.",
    "Управление двигателем, разборка и испытания.",
    "Практика разборки, проверки и ремонта двигателя.",
    "Калибровка положения двигателя, испытания и поиск неисправностей.",
    "Итоговая аттестация и завершение обучения."
  ]
};

export const dayLabels = {
  en: (day) => `Day ${day}`,
  zh: (day) => `第 ${day} 天`,
  ar: (day) => `اليوم ${day}`,
  ru: (day) => `День ${day}`
};
