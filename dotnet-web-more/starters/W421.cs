// W421: Channel worker contracts / Drain channel batches of 1
namespace DotnetWeb;
public static class W421{

public static Task<int> Drain(ChannelReader<int> reader,ICollection<int> sink,CancellationToken token){throw new NotImplementedException("W421");}
}
