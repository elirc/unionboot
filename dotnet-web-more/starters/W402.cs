// W402: If-Match ETag concurrency / Strong If-Match revision 4
namespace DotnetWeb;
public static class W402{
public sealed class Store{public int Revision{get;set;}public string Value{get;set;}="";}
public static IResult Update(HttpContext context,Store store,string value){throw new NotImplementedException("W402");}
}
