"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[4212],{5964:(t,e,s)=>{s.d(e,{ZD:()=>u,uz:()=>l});s(8101);var a=s(7229),o=s(1520);s(5105);function r(){const{selectMessage:t}=(0,o.W)();return e=>t(e,(0,a.T)({id:"theme.blog.post.plurals",description:'Pluralized label for "{count} posts". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',message:"One post|{count} posts"},{count:e}))}function u(t){const e=r();return(0,a.T)({id:"theme.blog.tagTitle",description:"The title of the page for a blog tag",message:'{nPosts} tagged with "{tagName}"'},{nPosts:e(t.count),tagName:t.label})}const l=()=>(0,a.T)({id:"theme.blog.authorsList.pageTitle",message:"Authors",description:"The title of the authors page"})},7629:(t,e,s)=>{s.r(e),s.d(e,{default:()=>m});s(8101);var a=s(3526),o=s(8154),r=s(4166),u=s(5964),l=s(4113),n=s(3992),i=s(9653),c=s(2631);const h={authorListItem:"authorListItem_ynuv"};var g=s(5105);function p(t){let{author:e}=t;return(0,g.jsx)("li",{className:h.authorListItem,children:(0,g.jsx)(c.A,{as:"h2",author:e,count:e.count})})}function d(t){let{authors:e}=t;return(0,g.jsx)("section",{className:(0,a.A)("margin-vert--lg",h.authorsListSection),children:(0,g.jsx)("ul",{children:e.map((t=>(0,g.jsx)(p,{author:t},t.key)))})})}function m(t){let{authors:e,sidebar:s}=t;const c=(0,u.uz)();return(0,g.jsxs)(o.e3,{className:(0,a.A)(r.G.wrapper.blogPages,r.G.page.blogAuthorsListPage),children:[(0,g.jsx)(o.be,{title:c}),(0,g.jsx)(n.A,{tag:"blog_authors_list"}),(0,g.jsxs)(l.A,{sidebar:s,children:[(0,g.jsx)(i.A,{as:"h1",children:c}),(0,g.jsx)(d,{authors:e})]})]})}}}]);