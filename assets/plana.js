/* ==========================================================================
   PLAN A TECHNOLOGIES — shared front-end behavior
   Requires (loaded per page): GSAP, ScrollTrigger, and (hero pages) Three.js
   ========================================================================== */
(function(){
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- NAV: scroll state + mobile toggle ---------- */
  var nav = document.querySelector("nav.site");
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if(nav){
    var onScroll = function(){ nav.classList.toggle("scrolled", window.scrollY > 30); };
    onScroll(); window.addEventListener("scroll", onScroll, {passive:true});
  }
  if(toggle && links){
    toggle.addEventListener("click", function(){
      var open = links.classList.toggle("open");
      toggle.textContent = open ? "✕" : "☰";
    });
    links.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", function(){ links.classList.remove("open"); toggle.textContent = "☰"; });
    });
  }

  /* ---------- Nav: inject Creative Studio dropdown ---------- */
  (function(){
    if(!links || links.querySelector(".nav-dd")) return;
    var svc=links.querySelector('a[href*="services.html"]');
    var prefix=(svc && /^\.\.\//.test(svc.getAttribute("href"))) ? "../" : "";
    var dd=document.createElement("div"); dd.className="nav-dd";
    dd.innerHTML='<button class="nav-dd-toggle" type="button">Creative Studio <span class="cr">▾</span></button>'+
      '<div class="nav-dd-menu"><a href="'+prefix+'ux-studio.html">UX Studio</a>'+
      '<a href="#" aria-disabled="true">Game Studio</a></div>';
    var work=links.querySelector('a[href*="work.html"]');
    if(work) links.insertBefore(dd, work.nextSibling); else links.appendChild(dd);
    dd.querySelector(".nav-dd-toggle").addEventListener("click",function(e){
      e.stopPropagation(); dd.classList.toggle("open");
    });
  })();

  /* ---------- Marquees (infinite loop) ---------- */
  function mq(el, dir){
    if(!el || !window.gsap) return;
    var full = el.scrollWidth / 2;
    gsap.to(el, {x: dir<0 ? -full : 0, duration: 26, ease:"none", repeat:-1,
      modifiers:{ x: gsap.utils.unitize(function(v){ var n = parseFloat(v)%full; return dir<0 ? n : n-full; }) }});
  }
  document.querySelectorAll("[data-marquee]").forEach(function(el){
    mq(el, el.getAttribute("data-marquee") === "right" ? 1 : -1);
  });

  if(!window.gsap){ return; }
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Hero headline rise ---------- */
  if(!reduce){
    gsap.to(".hero h1 .l i", {y:0, duration:1.1, stagger:.12, ease:"power4.out", delay:.15});
    gsap.from(".hero-tag,.subline,.hero-sub", {y:22, opacity:0, duration:1, stagger:.14, delay:.5, ease:"power3.out"});
    gsap.to(".split .l i", {y:0, duration:1, stagger:.09, ease:"power4.out",
      scrollTrigger:{trigger:".split", start:"top 82%"}});
  }

  /* ---------- Word-by-word statement reveal ---------- */
  document.querySelectorAll(".reveal-words").forEach(function(el){
    el.innerHTML = el.innerHTML.replace(/(<span class="o">.*?<\/span>|[^\s<]+)(\s*)/g,
      function(m, word, sp){ return '<span class="w"><i>'+word+'</i></span>'+sp; });
    if(reduce) return;
    gsap.to(el.querySelectorAll(".w i"), {y:0, duration:.9, stagger:.055, ease:"power4.out",
      scrollTrigger:{trigger:el, start:"top 82%"}});
  });

  /* ---------- Generic fade-ups ---------- */
  if(!reduce){
    gsap.utils.toArray(".reveal, .sec-head, .tile, .case, .cube, .reason, .cs-block, .process .step, .cta h2, .cta .btn, .logos .lead")
      .forEach(function(el){
        gsap.from(el, {y:42, opacity:0, duration:.9, ease:"power3.out",
          scrollTrigger:{trigger:el, start:"top 88%"}});
      });
    gsap.from(".logo-grid div", {opacity:0, y:22, duration:.5, stagger:.03, ease:"power2.out",
      scrollTrigger:{trigger:".logo-grid", start:"top 84%"}});
    gsap.from(".chips .chip", {opacity:0, y:18, duration:.5, stagger:.02, ease:"power2.out",
      scrollTrigger:{trigger:".chips", start:"top 85%"}});
  }

  /* ---------- Count-up stats ---------- */
  document.querySelectorAll("[data-to]").forEach(function(el){
    var to = parseFloat(el.getAttribute("data-to"));
    var span = el.querySelector(".v");
    var dec = (to % 1 !== 0);
    if(!span) return;
    if(reduce){ span.textContent = dec ? to.toFixed(1) : to; return; }
    var o = {v:0};
    gsap.to(o, {v:to, duration:1.9, ease:"power2.out",
      scrollTrigger:{trigger:el, start:"top 88%"},
      onUpdate:function(){ span.textContent = dec ? o.v.toFixed(1) : Math.floor(o.v); }});
  });

  /* ---------- STAT CUBES: tilt toward cursor ---------- */
  document.querySelectorAll(".cube").forEach(function(cube){
    var inner=cube.querySelector(".cube-inner"); if(!inner || reduce) return;
    var rest="rotateX(-12deg) rotateY(16deg)";
    cube.addEventListener("mousemove",function(e){
      var r=cube.getBoundingClientRect();
      var px=(e.clientX-r.left)/r.width-0.5, py=(e.clientY-r.top)/r.height-0.5;
      var ry=px*26, rx=-py*22;
      inner.style.transform="rotateX("+rx.toFixed(1)+"deg) rotateY("+ry.toFixed(1)+"deg)";
    });
    cube.addEventListener("mouseleave",function(){ inner.style.transform=rest; });
  });

  /* ---------- Accordion rows (tap to open on touch) ---------- */
  document.querySelectorAll(".srow").forEach(function(row){
    row.addEventListener("click", function(){ row.classList.toggle("open"); });
  });

  /* ---------- Three.js cubic hero (only if canvas + THREE present) ---------- */
  (function(){
    var canvas = document.getElementById("fx");
    if(!canvas || !window.THREE || reduce) return;
    var renderer = new THREE.WebGLRenderer({canvas:canvas, alpha:true, antialias:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    var scene = new THREE.Scene();
    var w = canvas.offsetWidth, h = canvas.offsetHeight;
    var cam = new THREE.PerspectiveCamera(42, w/h, 0.1, 100); cam.position.z = 4.6;

    var rig = new THREE.Group(); scene.add(rig);
    var grp = new THREE.Group(); rig.add(grp);

    var SEG = 22;
    var geo = new THREE.BoxGeometry(2.0,2.0,2.0,SEG,SEG,SEG);
    var base = geo.attributes.position.array.slice();
    var wire = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({color:0xFF5A16, wireframe:true, transparent:true, opacity:.5}));
    var pts = new THREE.Points(geo, new THREE.PointsMaterial({color:0xF4F1EA, size:0.026, transparent:true, opacity:.9}));
    grp.add(wire); grp.add(pts);

    var cage = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(3.4,3.4,3.4)),
      new THREE.LineBasicMaterial({color:0xFF5A16, transparent:true, opacity:.2}));
    rig.add(cage);

    function noise(x,y,z,t){
      return Math.sin(x*1.6+t)*0.5 + Math.sin(y*1.9-t*1.1)*0.35 + Math.sin(z*2.2+t*0.7)*0.3;
    }
    function size(){ w=canvas.offsetWidth; h=canvas.offsetHeight; renderer.setSize(w,h,false);
      cam.aspect=w/h; cam.updateProjectionMatrix(); }
    size(); window.addEventListener("resize", size);

    var mx=0,my=0,tx=0,ty=0;
    window.addEventListener("mousemove", function(e){ mx=(e.clientX/window.innerWidth-.5); my=(e.clientY/window.innerHeight-.5); });

    var pos = geo.attributes.position;
    function frame(t){
      t*=0.001;
      var pulse = 1 + 0.05*Math.sin(t*1.7);
      for(var i=0;i<pos.count;i++){
        var ix=i*3, ox=base[ix], oy=base[ix+1], oz=base[ix+2];
        var n = 0.14*noise(ox,oy,oz,t);
        var ax=Math.abs(ox), ay=Math.abs(oy), az=Math.abs(oz);
        if(ax>=ay && ax>=az) ox += Math.sign(ox)*n;
        else if(ay>=ax && ay>=az) oy += Math.sign(oy)*n;
        else oz += Math.sign(oz)*n;
        pos.array[ix]=ox*pulse; pos.array[ix+1]=oy*pulse; pos.array[ix+2]=oz*pulse;
      }
      pos.needsUpdate = true;
      tx += (mx-tx)*.05; ty += (my-ty)*.05;
      rig.rotation.y = tx*0.7; rig.rotation.x = ty*0.6;
      grp.rotation.y += 0.003; grp.rotation.x += 0.0016;
      cage.rotation.y -= 0.0011; cage.rotation.x += 0.0007;
      var sc = Math.min(window.scrollY/window.innerHeight, 1);
      rig.position.y = sc*1.4; rig.scale.setScalar(1 - sc*0.25);
      renderer.render(scene, cam);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  })();

  /* ---------- HERO VERB ROTATOR (modes A/B/C/D) ---------- */
  document.querySelectorAll(".rotator").forEach(function(host){
    var words = (host.getAttribute("data-words")||"").split(",").map(function(s){return s.trim();}).filter(Boolean);
    if(!words.length) return;
    var mode = host.getAttribute("data-rotator") || "A";
    var interval = parseInt(host.getAttribute("data-interval")||"2200",10);
    var i = 0;
    // width sizer keeps layout from jumping
    function sizeTo(txt){
      var m = document.createElement("span");
      m.style.cssText="position:absolute;visibility:hidden;white-space:nowrap;font:inherit;letter-spacing:inherit";
      m.textContent = txt; host.appendChild(m); var w = m.offsetWidth; m.remove();
      host.style.minWidth = w + "px";
    }
    if(reduce){ host.textContent = words[0]; return; }

    if(mode==="A" || mode==="D"){
      function place(first){
        var el=document.createElement("span"); el.className="rword"; el.textContent=words[i];
        host.appendChild(el); sizeTo(words[i]);
        if(first){ if(window.gsap) gsap.set(el,{rotateX:0,y:0,skewY:0,opacity:1}); return el; }
        if(!window.gsap){ return el; }
        if(mode==="A"){ gsap.set(el,{rotateX:-92,y:"38%",opacity:0,transformOrigin:"center bottom"});
          gsap.to(el,{rotateX:0,y:0,opacity:1,duration:.6,ease:"power3.out"}); }
        else { gsap.set(el,{y:"110%",skewY:8,opacity:0});
          gsap.to(el,{y:0,skewY:0,opacity:1,duration:.5,ease:"back.out(1.6)"}); }
        return el;
      }
      var cur = place(true);
      setInterval(function(){
        var old=cur;
        if(window.gsap){
          if(mode==="A") gsap.to(old,{rotateX:92,y:"-38%",opacity:0,duration:.5,ease:"power3.in",onComplete:function(){old.remove();}});
          else gsap.to(old,{y:"-110%",skewY:-8,opacity:0,duration:.42,ease:"power3.in",onComplete:function(){old.remove();}});
        } else old.remove();
        i=(i+1)%words.length; cur=place(false);
      }, interval);
    }
    else if(mode==="B"){
      var word=document.createElement("span"); word.className="rword"; word.textContent=words[0];
      var flash=document.createElement("span"); flash.className="flash";
      host.appendChild(word); host.appendChild(flash); sizeTo(words[0]);
      setInterval(function(){
        host.classList.remove("on"); void host.offsetWidth; host.classList.add("on");
        setTimeout(function(){ i=(i+1)%words.length; word.textContent=words[i]; sizeTo(words[i]); }, 300);
      }, interval);
    }
    else if(mode==="C"){
      var chars="ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&/<>_";
      var out=document.createElement("span"); out.className="rword";
      var caret=document.createElement("span"); caret.className="caret"; caret.textContent="_";
      host.appendChild(out); host.appendChild(caret);
      function scramble(target){
        sizeTo(target); var frame=0, steps=16, len=target.length;
        var iv=setInterval(function(){
          var s="";
          for(var k=0;k<len;k++){ s += (k < (frame/steps)*len) ? target[k] : chars[Math.floor(Math.random()*chars.length)]; }
          out.textContent=s; frame++;
          if(frame>steps){ clearInterval(iv); out.textContent=target; }
        }, 26);
      }
      scramble(words[0]);
      setInterval(function(){ i=(i+1)%words.length; scramble(words[i]); }, interval);
    }
  });

  /* ---------- AWARD SLIDES CAROUSEL ---------- */
  document.querySelectorAll("[data-carousel]").forEach(function(root){
    var track=root.querySelector(".slides-track");
    var slides=track?track.children.length:0; if(!slides) return;
    var dotsWrap=root.querySelector(".slides-dots");
    var countCur=root.querySelector(".count b");
    var idx=0, timer;
    var dots=[];
    if(dotsWrap){ for(var d=0;d<slides;d++){ var dot=document.createElement("i"); if(d===0)dot.className="on";
      (function(n){dot.addEventListener("click",function(){go(n);reset();});})(d); dotsWrap.appendChild(dot); dots.push(dot);} }
    function go(n){ idx=(n+slides)%slides; track.style.transform="translateX("+(-idx*100)+"%)";
      dots.forEach(function(x,j){x.classList.toggle("on",j===idx);}); if(countCur) countCur.textContent=idx+1; }
    function reset(){ clearInterval(timer); timer=setInterval(function(){go(idx+1);}, 4200); }
    var prev=root.querySelector("[data-prev]"), next=root.querySelector("[data-next]");
    if(prev) prev.addEventListener("click",function(){go(idx-1);reset();});
    if(next) next.addEventListener("click",function(){go(idx+1);reset();});
    if(!reduce) reset();
  });

  /* ---------- TOP 10 — sliding image reel + fixed text that scrambles between frames ---------- */
  (function(){
    var sec=document.querySelector(".countdown"); if(!sec) return;
    var track=sec.querySelector(".cd-track");
    var items=Array.prototype.slice.call(sec.querySelectorAll(".cd-item"));
    var bar=sec.querySelector(".cd-progress i");
    var headNum=sec.querySelector(".cd-head .num");
    var fg=sec.querySelector(".cd-fg");
    var n=items.length; if(!n || !track) return;

    var data=items.map(function(it){
      return { rank: it.getAttribute("data-rank"),
        title:(it.querySelector("h3")||{}).textContent ? it.querySelector("h3").textContent.trim() : "",
        copy:(it.querySelector("p")||{}).textContent ? it.querySelector("p").textContent.trim() : "" };
    });
    var fgRk=fg&&fg.querySelector(".rk"), fgTitle=fg&&fg.querySelector(".fg-title"), fgCopy=fg&&fg.querySelector("p");
    var curIdx=-1;
    var CH="ABCDEFGHIJKLMNOPQRSTUVWXYZ#@%&/<>*";
    function scramble(el,target){
      if(!el) return;
      if(reduce){ el.textContent=target; return; }
      clearInterval(el._iv);
      var frame=0, steps=12, len=target.length;
      el._iv=setInterval(function(){
        var s=""; for(var k=0;k<len;k++){ s += (k<(frame/steps)*len) ? target.charAt(k) : CH.charAt(Math.floor(Math.random()*CH.length)); }
        el.textContent=s; frame++;
        if(frame>steps){ clearInterval(el._iv); el.textContent=target; }
      },26);
    }
    function setFrame(k){
      if(k===curIdx || !fg) return; curIdx=k;
      if(fgRk) fgRk.innerHTML="#<b>"+data[k].rank+"</b>";
      scramble(fgTitle,data[k].title);
      if(fgCopy){ fgCopy.style.opacity=0; clearTimeout(fgCopy._t);
        fgCopy._t=setTimeout(function(){ fgCopy.textContent=data[k].copy; fgCopy.style.opacity=1; },160); }
      if(headNum) headNum.textContent=data[k].rank;
    }

    function place(pos){
      track.style.transform="translateX("+(-pos*100).toFixed(3)+"vw)";
      var nearest=Math.max(0,Math.min(n-1,Math.round(pos)));
      items.forEach(function(it,i){ it.classList.toggle("active", i===nearest); });
      setFrame(nearest);
    }

    if(reduce || !window.ScrollTrigger){
      var pin=sec.querySelector(".cd-pin");
      pin.style.position="static"; pin.style.height="auto";
      track.style.position="static"; track.style.flexDirection="column"; track.style.transform="none"; track.style.height="auto";
      items.forEach(function(it){ it.style.flex="none"; it.style.width="100%"; it.style.height="auto"; it.style.minHeight="70vh";
        var cc=it.querySelector(".cd-content");
        if(cc) cc.setAttribute("style","position:absolute;inset:0;z-index:2;display:flex;align-items:center;width:auto;height:auto;clip:auto;clip-path:none;white-space:normal;overflow:visible;margin:0;padding:clamp(26px,4vw,56px)"); });
      if(fg) fg.style.display="none";
      return;
    }

    // dwell easing — hold on each frame (text settles), then the reel advances
    function easeStep(s){ var base=Math.floor(s), frac=s-base;
      var f=Math.max(0,Math.min(1,(frac-0.30)/0.40)); f=f*f*(3-2*f); return base+f; }
    setFrame(0); place(0);
    ScrollTrigger.create({trigger:sec,start:"top top",end:"bottom bottom",scrub:0.6,
      onUpdate:function(s){ var p=s.progress; if(bar) bar.style.width=(p*100).toFixed(1)+"%";
        place(easeStep(p*(n-1))); }});
  })();

  /* ---------- WHAT WE DO — pinned scroll-wipe sequence ---------- */
  (function(){
    var sec=document.querySelector(".wwd"); if(!sec) return;
    var b=sec.querySelector(".wwd-b"), c=sec.querySelector(".wwd-c");
    var counted=false;
    function runCount(){
      sec.querySelectorAll(".ministat [data-count]").forEach(function(el){
        var to=parseFloat(el.getAttribute("data-count")), v=el.querySelector(".v"), dec=(to%1!==0);
        if(!v) return; var o={v:0};
        gsap.to(o,{v:to,duration:1.4,ease:"power2.out",
          onUpdate:function(){ v.textContent = dec ? o.v.toFixed(1) : Math.floor(o.v); }});
      });
    }
    if(reduce || !window.ScrollTrigger){
      sec.classList.add("plain");
      if(b) b.style.clipPath="none"; if(c) c.style.clipPath="none"; runCount(); return;
    }
    function seg(p,a,z){ return Math.min(1,Math.max(0,(p-a)/(z-a))); }
    // angled (~30deg) leading edge wipe, reveals left→right
    var OFF=16;
    function wipe(t){ var W=t*(100+OFF);
      return "polygon(0% 0%, "+W.toFixed(2)+"% 0%, "+(W-OFF).toFixed(2)+"% 100%, 0% 100%)"; }
    ScrollTrigger.create({trigger:sec,start:"top top",end:"bottom bottom",scrub:true,
      onUpdate:function(s){ var p=s.progress;
        if(b) b.style.clipPath=wipe(seg(p,0.26,0.46));
        if(c) c.style.clipPath=wipe(seg(p,0.60,0.80));
        if(!counted && p>0.66){ counted=true; runCount(); }
      }});
  })();

  /* ---------- INVERT CTA (scroll-driven wipe) ---------- */
  (function(){
    var sec=document.querySelector(".cta-invert"); if(!sec || !window.ScrollTrigger) return;
    var over=sec.querySelector(".cta-layer.over");
    var hint=document.getElementById("ctaHint");
    if(reduce){ if(over) over.style.clipPath="inset(0 0 0 0)"; if(hint) hint.style.opacity=0; return; }
    if(hint) hint.style.transition="opacity .3s ease";
    ScrollTrigger.create({trigger:sec,start:"top top",end:"bottom bottom",scrub:true,
      onUpdate:function(s){ if(over) over.style.clipPath="inset("+((1-s.progress)*100).toFixed(2)+"% 0 0 0)";
        if(hint) hint.style.opacity = s.progress<0.03 ? 1 : Math.max(0,1-s.progress*8); }});
  })();

  /* ---------- 3D DIGITAL GLOBE ---------- */
  (function(){
    var canvas=document.getElementById("globe"); if(!canvas || !window.THREE || reduce) return;
    var renderer=new THREE.WebGLRenderer({canvas:canvas,alpha:true,antialias:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    var scene=new THREE.Scene();
    var w=canvas.offsetWidth||600,h=canvas.offsetHeight||500;
    var cam=new THREE.PerspectiveCamera(38,w/h,0.1,100); cam.position.z=3.85;
    var world=new THREE.Group(); scene.add(world); world.rotation.z=-0.35;

    var R=1.35;
    // dotted sphere (fibonacci lattice) — shown until the real map texture loads, then hidden (offline fallback)
    var N=2600, pg=new THREE.BufferGeometry(), arr=new Float32Array(N*3);
    var off=Math.PI*(3-Math.sqrt(5));
    for(var i=0;i<N;i++){ var y=1-(i/(N-1))*2; var r=Math.sqrt(1-y*y); var th=off*i;
      arr[i*3]=Math.cos(th)*r*R; arr[i*3+1]=y*R; arr[i*3+2]=Math.sin(th)*r*R; }
    pg.setAttribute("position",new THREE.BufferAttribute(arr,3));
    var pts=new THREE.Points(pg,new THREE.PointsMaterial({color:0xFF5A16,size:0.02,transparent:true,opacity:.85}));
    world.add(pts);
    // orange graticule (kept visible over the map for a "digital" read)
    var wire=new THREE.Mesh(new THREE.SphereGeometry(R*1.004,30,22),
      new THREE.MeshBasicMaterial({color:0xFF5A16,wireframe:true,transparent:true,opacity:.16}));
    world.add(wire);
    // real world-map globe (equirectangular earth texture) tinted BRIGHT so it reads on navy
    var coreMat=new THREE.MeshBasicMaterial({color:0x1a2340});
    var core=new THREE.Mesh(new THREE.SphereGeometry(R*0.99,64,48), coreMat);
    world.add(core);
    var loader=new THREE.TextureLoader(); loader.setCrossOrigin("anonymous");
    loader.load("https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-dark.jpg",
      function(tex){ coreMat.map=tex; coreMat.color.set(0xaebcdd); coreMat.needsUpdate=true;
        pts.visible=false; },
      undefined,
      function(){ /* offline: keep dotted globe fallback */ });
    // orange atmosphere rim (stronger, plus outer glow shell)
    var atmo=new THREE.Mesh(new THREE.SphereGeometry(R*1.02,48,32),
      new THREE.MeshBasicMaterial({color:0xFF5A16,transparent:true,opacity:.14,side:THREE.BackSide}));
    world.add(atmo);
    var glow=new THREE.Mesh(new THREE.SphereGeometry(R*1.14,48,32),
      new THREE.MeshBasicMaterial({color:0xFF5A16,transparent:true,opacity:.05,side:THREE.BackSide}));
    world.add(glow);
    // orbiting arc rings
    var ringGrp=new THREE.Group(); world.add(ringGrp);
    for(var k=0;k<3;k++){
      var ring=new THREE.Mesh(new THREE.TorusGeometry(R*(1.18+k*0.16),0.004,8,120),
        new THREE.MeshBasicMaterial({color:0xFF5A16,transparent:true,opacity:.35-k*0.08}));
      ring.rotation.x=Math.PI/2 + (k*0.5-0.5); ring.rotation.y=k*0.6; ringGrp.add(ring);
    }
    function size(){ w=canvas.offsetWidth; h=canvas.offsetHeight; renderer.setSize(w,h,false);
      cam.aspect=w/h; cam.updateProjectionMatrix(); }
    size(); window.addEventListener("resize",size);
    (function loop(){ world.rotation.y+=0.0022; ringGrp.rotation.y-=0.0016; ringGrp.rotation.z+=0.0009;
      renderer.render(scene,cam); requestAnimationFrame(loop); })();
  })();

  /* ---------- PLEXUS AMBIENT (What We Do) ---------- */
  (function(){
    var canvas=document.getElementById("ambient"); if(!canvas || reduce) return;
    var ctx=canvas.getContext("2d"); var w,h,dpr=Math.min(devicePixelRatio||1,2);
    var pts=[], N=0, DIST=170;
    function seed(){ var target=Math.max(60,Math.min(150,Math.round(w*h/12000)));
      while(pts.length<target) pts.push({x:Math.random()*w,y:Math.random()*h,
        vx:(Math.random()-.5)*0.26,vy:(Math.random()-.5)*0.26,r:Math.random()*1.7+0.6,o:Math.random()<0.16});
      pts.length=target; N=target; }
    function resize(){ w=canvas.offsetWidth; h=canvas.offsetHeight; canvas.width=w*dpr; canvas.height=h*dpr;
      ctx.setTransform(dpr,0,0,dpr,0,0); seed(); }
    resize(); addEventListener("resize",resize);
    function frame(){
      ctx.clearRect(0,0,w,h);
      for(var i=0;i<N;i++){ var p=pts[i]; p.x+=p.vx; p.y+=p.vy;
        if(p.x<0||p.x>w)p.vx*=-1; if(p.y<0||p.y>h)p.vy*=-1; }
      for(var i=0;i<N;i++){ for(var j=i+1;j<N;j++){
        var a=pts[i],b=pts[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.sqrt(dx*dx+dy*dy);
        if(d<DIST){ ctx.globalAlpha=(1-d/DIST)*0.24; ctx.strokeStyle="#5566aa"; ctx.lineWidth=1;
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); } } }
      for(var i=0;i<N;i++){ var p=pts[i]; ctx.globalAlpha=p.o?0.9:0.5;
        ctx.fillStyle=p.o?"#FF5A16":"#9fb0d0"; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,7); ctx.fill(); }
      ctx.globalAlpha=1; requestAnimationFrame(frame);
    }
    frame();
  })();

  /* ---------- RECLAIMED RIPPLING CUBE (What We Do right column) ---------- */
  (function(){
    var canvas=document.getElementById("whatCube"); if(!canvas || !window.THREE || reduce) return;
    var renderer=new THREE.WebGLRenderer({canvas:canvas,alpha:true,antialias:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    var scene=new THREE.Scene();
    var w=canvas.offsetWidth||500,h=canvas.offsetHeight||440;
    var cam=new THREE.PerspectiveCamera(42,w/h,0.1,100); cam.position.z=4.4;
    var rig=new THREE.Group(); scene.add(rig);
    var grp=new THREE.Group(); rig.add(grp);
    var SEG=20, geo=new THREE.BoxGeometry(2,2,2,SEG,SEG,SEG);
    var base=geo.attributes.position.array.slice();
    grp.add(new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:0xFF5A16,wireframe:true,transparent:true,opacity:.5})));
    grp.add(new THREE.Points(geo,new THREE.PointsMaterial({color:0xF4F1EA,size:0.026,transparent:true,opacity:.9})));
    var cage=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(3.3,3.3,3.3)),
      new THREE.LineBasicMaterial({color:0xFF5A16,transparent:true,opacity:.2})); rig.add(cage);
    function noise(x,y,z,t){ return Math.sin(x*1.6+t)*0.5+Math.sin(y*1.9-t*1.1)*0.35+Math.sin(z*2.2+t*0.7)*0.3; }
    function size(){ w=canvas.offsetWidth; h=canvas.offsetHeight; renderer.setSize(w,h,false);
      cam.aspect=w/h; cam.updateProjectionMatrix(); }
    size(); addEventListener("resize",size);
    var mx=0,my=0,tx=0,ty=0;
    addEventListener("mousemove",function(e){ mx=(e.clientX/innerWidth-.5); my=(e.clientY/innerHeight-.5); });
    var pos=geo.attributes.position;
    function frame(t){ t*=0.001; var pulse=1+0.05*Math.sin(t*1.7);
      for(var i=0;i<pos.count;i++){ var ix=i*3,ox=base[ix],oy=base[ix+1],oz=base[ix+2];
        var nn=0.14*noise(ox,oy,oz,t),ax=Math.abs(ox),ay=Math.abs(oy),az=Math.abs(oz);
        if(ax>=ay&&ax>=az)ox+=Math.sign(ox)*nn; else if(ay>=ax&&ay>=az)oy+=Math.sign(oy)*nn; else oz+=Math.sign(oz)*nn;
        pos.array[ix]=ox*pulse; pos.array[ix+1]=oy*pulse; pos.array[ix+2]=oz*pulse; }
      pos.needsUpdate=true;
      tx+=(mx-tx)*.05; ty+=(my-ty)*.05; rig.rotation.y=tx*0.7; rig.rotation.x=ty*0.6;
      grp.rotation.y+=0.003; grp.rotation.x+=0.0016; cage.rotation.y-=0.0011; cage.rotation.x+=0.0007;
      renderer.render(scene,cam); requestAnimationFrame(frame); }
    requestAnimationFrame(frame);
  })();
})();
