// W526: Header propagation policies / Allowlist X-Client-Version and baggage
namespace DotnetWeb;
public static class W526{

public static IHeaderDictionary Propagate(IHeaderDictionary incoming){
var result=new HeaderDictionary();foreach(var name in new[]{"X-Client-Version","baggage"})if(incoming.TryGetValue(name,out var values))result[name]=new StringValues(values.ToArray());return result;
}
}
