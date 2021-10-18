import dynamic from 'next/dynamic'

  const PixiComponent = dynamic(() => import('../components/PixiComponent'), {
   ssr: false,
 })

  export default function IndexPage() {
   return (
     <div>
       <h1>Testing Headding</h1>
       <PixiComponent />
       <pre>This is really small text</pre>
     </div>
   )
 }
