// W354: LinkGenerator path resolution / Named invoices link under version 4
namespace DotnetWeb;
public static class W354{

public static string? Resolve(LinkGenerator generator,int id){
return generator.GetPathByName("invoices",new {id},pathBase:new PathString("/v4"));
}
}
