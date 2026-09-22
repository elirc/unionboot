// W351: LinkGenerator path resolution / Named widgets link under version 1
namespace DotnetWeb;
public static class W351{

public static string? Resolve(LinkGenerator generator,int id){
return generator.GetPathByName("widgets",new {id},pathBase:new PathString("/v1"));
}
}
