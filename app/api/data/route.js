
// type ResponseData = {
//   message: string
// }
 
export async function GET() {
	return new Response(JSON.stringify({"mess":"helloworld"}));
}
