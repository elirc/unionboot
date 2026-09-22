// W360: LinkGenerator path resolution / Named audit link under version 10
namespace DotnetWeb;
public static class W360{

public static string? Resolve(LinkGenerator generator,int id){
return generator.GetPathByName("audit",new {id},pathBase:new PathString("/v10"));
}
}
