import React from "react";
const titles = { zh:"四个在线业务协作全景", en:"Four Online Collaboration Model", ar:"نموذج التعاون عبر المجالات الأربعة", ru:"Модель взаимодействия четырёх онлайн-направлений" };
const notes = { zh:"点击图中节点查看详情；手机上可左右滑动查看全图。", en:"Select a node to explore. On mobile, swipe horizontally to view the full diagram.", ar:"اختر عنصراً لعرض التفاصيل؛ اسحب أفقياً على الهاتف لعرض المخطط كاملاً.", ru:"Выберите элемент для подробностей. На телефоне прокрутите схему по горизонтали." };
const langs = {zh:'zh-CN',en:'en',ar:'ar',ru:'ru'};
export default function OnlineModel({lang}) {
 return <section className="reference-online-section" id="online-model"><div className="content-shell"><h2>{titles[lang]}</h2><p>{notes[lang]}</p><iframe key={lang} title={titles[lang]} src={'/reference-online/index.html?lang='+langs[lang]} loading="lazy" /></div></section>;
}
