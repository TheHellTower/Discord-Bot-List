/* isURL */
var protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;
var localhostDomainRE = /^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/
var nonLocalhostDomainRE = /^[^\s\.]+\.\S{2,}$/;

module.exports.isURL = (string) => {
    return typeof string === 'string' && (localhostDomainRE.test((match = string.match(protocolAndDomainRE)) && match[1]) || nonLocalhostDomainRE.test((match = string.match(protocolAndDomainRE)) && match[1])) ? true : false;
}
/* isURL */

/* isHTML */
var htmlTags = ["a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","blockquote","body","br","button","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","iframe","img","input","ins","kbd","label","legend","li","link","main","map","mark","math","menu","menuitem","meta","meter","nav","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress","q","rb","rp","rt","rtc","ruby","s","samp","script","section","select","slot","small","source","span","strong","style","sub","summary","sup","svg","table","tbody","td","template","textarea","tfoot","th","thead","time","title","tr","track","u","ul","var","video","wbr", "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "menuitem", "meta", "param", "source", "track", "wbr" ];
const basic = /\s?<!doctype html>|(<html\b[^>]*>|<body\b[^>]*>|<x-[^>]+>)+/i;
const full = new RegExp(htmlTags.map(tag => `<${tag}\\b[^>]*>`).join('|'), 'i');

module.exports.isHTML = (string) => {
    string = string.trim().slice(0, 1000);
    
	return basic.test(string) || full.test(string);
}
/* isHTML */