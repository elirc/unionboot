// W522: Header propagation policies / Allowlist X-Correlation-Id and baggage
namespace DotnetWeb;
public static class W522{

public static IHeaderDictionary Propagate(IHeaderDictionary incoming){
var result=new HeaderDictionary();foreach(var name in new[]{"X-Correlation-Id","baggage"})if(incoming.TryGetValue(name,out var values))result[name]=new StringValues(values.ToArray());return result;
}
}
