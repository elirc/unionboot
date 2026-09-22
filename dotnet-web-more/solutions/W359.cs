// W359: LinkGenerator path resolution / Named cities link under version 9
namespace DotnetWeb;
public static class W359{

public static string? Resolve(LinkGenerator generator,int id){
return generator.GetPathByName("cities",new {id},pathBase:new PathString("/v9"));
}
}
