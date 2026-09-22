// W356: LinkGenerator path resolution / Named teams link under version 6
namespace DotnetWeb;
public static class W356{

public static string? Resolve(LinkGenerator generator,int id){
return generator.GetPathByName("teams",new {id},pathBase:new PathString("/v6"));
}
}
