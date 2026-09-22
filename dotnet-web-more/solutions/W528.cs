// W528: Header propagation policies / Allowlist X-Request-Id and baggage
namespace DotnetWeb;
public static class W528{

public static IHeaderDictionary Propagate(IHeaderDictionary incoming){
var result=new HeaderDictionary();foreach(var name in new[]{"X-Request-Id","baggage"})if(incoming.TryGetValue(name,out var values))result[name]=new StringValues(values.ToArray());return result;
}
}
