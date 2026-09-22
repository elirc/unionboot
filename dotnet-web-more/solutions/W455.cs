// W455: Options post-configure validation / Normalize then validate multiplier 6
namespace DotnetWeb;
public static class W455{
public sealed class Settings{public int Limit{get;set;}}
public static ServiceProvider Configure(int initial){
var services=new ServiceCollection();services.AddOptions<Settings>().Configure(o=>o.Limit=initial).PostConfigure(o=>{if(o.Limit==0)o.Limit=1;o.Limit*=6;}).Validate(o=>o.Limit>0&&o.Limit<=60,"limit outside range");return services.BuildServiceProvider();
}
}
