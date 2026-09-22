// W406: If-Match ETag concurrency / Strong If-Match revision 8
namespace DotnetWeb;
public static class W406{
public sealed class Store{public int Revision{get;set;}public string Value{get;set;}="";}
public static IResult Update(HttpContext context,Store store,string value){throw new NotImplementedException("W406");}
}
