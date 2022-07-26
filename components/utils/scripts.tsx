import Script from 'next/script';
import * as fbq from '@lib/fbpixel';
import * as gtag from '@lib/gtag';

export const ExternalScripts = () => {
  return (
    <>
      <Script
        id="fb-pixel"
        strategy="worker"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', ${fbq.FB_PIXEL_ID});
          `,
        }}
      />

      {process.env.NODE_ENV !== 'development' ? (
        <>
          <div id="fb-root"></div>
          <div id="fb-customer-chat" className="fb-customerchat"></div>
          <Script id="fb-messenger" strategy="lazyOnload">
            {`
					var chatbox = document.getElementById('fb-customer-chat');
					chatbox.setAttribute("page_id", "112675403902811");
					chatbox.setAttribute("attribution", "biz_inbox");
					window.fbAsyncInit = function() {
						FB.init({
							xfbml            : true,
							version          : 'v14.0'
						});
					};
					(function(d, s, id) {
						var js, fjs = d.getElementsByTagName(s)[0];
						if (d.getElementById(id)) return;
						js = d.createElement(s); js.id = id;
						js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
						fjs.parentNode.insertBefore(js, fjs);
					}(document, 'script', 'facebook-jssdk'));
				`}
          </Script>

          <Script
            strategy="worker"
            src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
          />
          <script
            type="text/partytown"
            dangerouslySetInnerHTML={{
              __html: `
								window.dataLayer = window.dataLayer || [];
								window.gtag = function gtag(){window.dataLayer.push(arguments);}
								gtag('js', new Date());

								gtag('config', '${gtag.GA_TRACKING_ID}', { 
										page_path: window.location.pathname,
								});
							`,
            }}
          />
        </>
      ) : null}
    </>
  );
};
