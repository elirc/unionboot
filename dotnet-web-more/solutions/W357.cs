// W357: LinkGenerator path resolution / Named tags link under version 7
namespace DotnetWeb;
public static class W357{

public static string? Resolve(LinkGenerator generator,int id){
return generator.GetPathByName("tags",new {id},pathBase:new PathString("/v7"));
}
}
