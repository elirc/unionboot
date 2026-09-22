// W358: LinkGenerator path resolution / Named events link under version 8
namespace DotnetWeb;
public static class W358{

public static string? Resolve(LinkGenerator generator,int id){
return generator.GetPathByName("events",new {id},pathBase:new PathString("/v8"));
}
}
