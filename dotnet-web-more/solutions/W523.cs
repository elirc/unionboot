// W523: Header propagation policies / Allowlist X-Tenant-Id and baggage
namespace DotnetWeb;
public static class W523{

public static IHeaderDictionary Propagate(IHeaderDictionary incoming){
var result=new HeaderDictionary();foreach(var name in new[]{"X-Tenant-Id","baggage"})if(incoming.TryGetValue(name,out var values))result[name]=new StringValues(values.ToArray());return result;
}
}
