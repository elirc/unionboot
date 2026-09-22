// W457: Options post-configure validation / Normalize then validate multiplier 8
namespace DotnetWeb;
public static class W457{
public sealed class Settings{public int Limit{get;set;}}
public static ServiceProvider Configure(int initial){
var services=new ServiceCollection();services.AddOptions<Settings>().Configure(o=>o.Limit=initial).PostConfigure(o=>{if(o.Limit==0)o.Limit=1;o.Limit*=8;}).Validate(o=>o.Limit>0&&o.Limit<=80,"limit outside range");return services.BuildServiceProvider();
}
}
