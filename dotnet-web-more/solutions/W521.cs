// W521: Header propagation policies / Allowlist X-Trace-Id and baggage
namespace DotnetWeb;
public static class W521{

public static IHeaderDictionary Propagate(IHeaderDictionary incoming){
var result=new HeaderDictionary();foreach(var name in new[]{"X-Trace-Id","baggage"})if(incoming.TryGetValue(name,out var values))result[name]=new StringValues(values.ToArray());return result;
}
}
