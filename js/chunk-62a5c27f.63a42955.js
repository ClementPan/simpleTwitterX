(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-62a5c27f"],{"38c7":function(t,s,a){"use strict";a("ef1b")},"3bb6":function(t,s,a){"use strict";var e=[function(){var t=this.$createElement,t=this._self._c||t;return t("div",{staticClass:"icon"},[t("img",{attrs:{src:a("977e"),alt:""}})])}],i=(a("ac1f"),a("1276"),{name:"AdminSidebar",created:function(){var t=this.$route.path.split("/")[2];this.setCurrentLocation(t)},data:function(){return{tweets:!1,users:!1}},methods:{logout:function(){this.$store.commit("revokeAuthentication"),this.$router.push("/admin/signin")},setCurrentLocation:function(t){"tweets"===t?(this.tweets=!0,this.users=!1):(this.tweets=!1,this.users=!0)}}}),r=(a("38c7"),a("2877")),e=Object(r.a)(i,function(){var s=this,t=s.$createElement,t=s._self._c||t;return t("div",{staticClass:"userSidebar"},[t("div",{staticClass:"logo"},[t("router-link",{attrs:{to:"/main"}},[t("img",{attrs:{src:a("a1d8"),alt:""}})])],1),t("div",{staticClass:"buttonList"},[t("div",{staticClass:"navItem index"},[t("div",{staticClass:"icon"},[s.tweets?t("img",{attrs:{src:a("459f"),alt:""}}):t("img",{attrs:{src:a("10d1"),alt:""}})]),t("button",{staticClass:"btn"},[t("router-link",{attrs:{to:"/admin/tweets"}},[t("p",{class:{active:s.tweets},attrs:{id:"routerTweets"}},[s._v("推文清單")])])],1)]),t("div",{staticClass:"navItem userProfile"},[t("div",{staticClass:"icon"},[s.users?t("img",{attrs:{src:a("fc4c"),alt:""}}):t("img",{attrs:{src:a("4c9a"),alt:""}})]),t("button",{staticClass:"btn"},[t("router-link",{attrs:{to:"/admin/users"}},[t("p",{class:{active:s.users},attrs:{id:"routerUsers"}},[s._v("使用者列表")])])],1)]),t("div",{staticClass:"navItem logout"},[s._m(0),t("button",{staticClass:"btn",on:{click:function(t){return t.stopPropagation(),t.preventDefault(),s.logout(t)}}},[t("p",[s._v("登出")])])])])])},e,!1,null,"295c3b75",null);s.a=e.exports},6135:function(t,s,a){"use strict";a.r(s);var e=a("1da1"),i=(a("96cf"),a("3bb6")),r={name:"AdminUsersCard",props:{User:{type:Object,required:!0}},data:function(){return{user:this.User}}},n=(a("da84d"),a("2877")),c=Object(n.a)(r,function(){var t=this,s=t.$createElement,s=t._self._c||s;return s("div",{staticClass:"container"},[s("div",{staticClass:"card"},[s("div",{staticClass:"background-img"},[s("img",{staticClass:"card-img-top",attrs:{src:t.user.cover,alt:""}})]),s("div",{staticClass:"avatar"},[s("img",{staticClass:"card-img-top",attrs:{src:t.user.avatar,alt:""}})]),s("div",{staticClass:"card-body"},[s("h5",{staticClass:"card-title"},[t._v(t._s(t.user.name))]),s("p",{staticClass:"card-text"},[t._v("@"+t._s(t.user.account))]),s("div",{staticClass:"click-on-condition row"},[s("div",{staticClass:"reply-count"},[s("i",{staticClass:"far fa-comment"}),t._v(" "+t._s(t.user.tweetCount)+" ")]),s("div",{staticClass:"like-count"},[s("i",{staticClass:"far fa-heart"}),t._v(" "+t._s(t.user.likeCount)+" ")])]),s("div",{staticClass:"follow-condition row"},[s("div",{staticClass:"following-count"},[s("span",[t._v(t._s(t.user.followingCount)+"個")]),t._v("跟隨中 ")]),s("div",{staticClass:"follows-count"},[s("span",[t._v(t._s(t.user.followerCount)+"位")]),t._v("跟隨者 ")])])])])])},[],!1,null,"81e14eb8",null).exports,o=a("2fa3"),u=a("4cce"),r=a("b572"),r={name:"AdminUsers",components:{AdminSidebar:i.a,AdminUsersCard:c,Spinner:r.a},data:function(){return{users:[],isLoading:!0}},created:function(){this.fetchUsers()},methods:{fetchUsers:function(){var a=this;return Object(e.a)(regeneratorRuntime.mark(function t(){var s;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,u.a.getTotalUser();case 3:s=t.sent,s=s.data,a.users=s,a.isLoading=!1,t.next=14;break;case 9:t.prev=9,t.t0=t.catch(0),a.isLoading=!1,o.a.fire({icon:"error",title:"無法取得使用者資料，請稍後再試"});case 14:case"end":return t.stop()}},t,null,[[0,9]])}))()}}},r=(a("7a04"),Object(n.a)(r,function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("div",{attrs:{id:"AdminUsers"}},[t.isLoading?a("Spinner"):[a("AdminSidebar"),a("div",{staticClass:"AdminUsersPanel"},[a("div",{staticClass:"title"},[a("h1",[t._v("使用者列表")])]),a("div",{staticClass:"admin-users-card"},t._l(t.users,function(t){return a("AdminUsersCard",{key:t.id,attrs:{user:t}})}),1)])]],2)},[],!1,null,"121def38",null));s.default=r.exports},"78f9":function(t,s,a){},"7a04":function(t,s,a){"use strict";a("e77b")},da84d:function(t,s,a){"use strict";a("78f9")},e77b:function(t,s,a){},ef1b:function(t,s,a){}}]);