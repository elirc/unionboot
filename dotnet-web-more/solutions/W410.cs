// W410: If-Match ETag concurrency / Strong If-Match revision 12
namespace DotnetWeb;
public static class W410{
public sealed class Store{public int Revision{get;set;}public string Value{get;set;}="";}
public static IResult Update(HttpContext context,Store store,string value){
var match=context.Request.Headers["If-Match"].ToString();if(match.Length==0)return Results.StatusCode(428);var expected="\""+store.Revision+"\"";if(match!="*"&&match!=expected)return Results.StatusCode(412);store.Value=value;store.Revision++;context.Response.Headers["ETag"]="\""+store.Revision+"\"";return Results.NoContent();
}
}
