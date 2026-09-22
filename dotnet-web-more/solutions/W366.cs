// W366: IRouteConstraint evaluation / Numeric range constraint 1..7
namespace DotnetWeb;
public static class W366{

public static IRouteConstraint Create(){
return new PredicateConstraint((key,values)=>values.TryGetValue(key,out var raw)&&long.TryParse(raw?.ToString(),out var n)&&n>=1&&n<=7);
}
}
